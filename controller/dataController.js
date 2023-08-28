require("dotenv").config();
const { fetchPrices, generateTransId } = require("../utils");
const Transaction = require("../model/Transaction");
const { default: axios } = require("axios");

const fetchDataPrices = async (req, res) => {
  const { service_id, requestType } = req.body;
  try {
    const details = await fetchPrices(service_id, requestType);
    return res.status(200).json(details);
  } catch (error) {
    return res.status(500).json({
      message: "unable to handle error",
    });
  }
};

const buyData = async (req, res) => {
  const { amount, beneficiary, code, service_id, service_type } = req.body;
  const user = req.user;
  const userWallet = req.user.wallet;
  const userBalance = userWallet.current_balance;
  // create a unique transaction_id
  let transaction_id;
  while (true) {
    transaction_id = generateTransId();
    const existingTrans = await Transaction.findOne({
      reference_number: transaction_id,
    });
    if (!existingTrans) {
      break;
    }
  }
  // create transaction with pending status
  const transaction = new Transaction({
    user: user._id,
    amount: Number(amount),
    balance_before: userBalance,
    balance_after: userBalance,
    status: "pending",
    service: "data",
    type: "debit",
    description: `${amount} data purchase for ${beneficiary}`,
    reference_number: transaction_id,
  });
  // form request data
  const req_data = {
    amount,
    beneficiary,
    code,
    service_id,
    service_type,
    trans_id: transaction_id,
  };
  // send request to server
  try {
    const response = await axios.post(
      "https://enterprise.mobilenig.com/api/services/",
      req_data,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const { data } = response;
    const { message } = data;
    if (message !== "success") {
      return res.status(422).json({
        message: "unable to process transaction, please check your inputs ",
        success: false,
      });
    }
    // update transaction to be concluded
    transaction.status = "completed";
    transaction.balance_after = userBalance - Number(amount);
    // deduct transaction amount from user wallet
    userWallet.previous_balance = userBalance;
    userWallet.current_balance = userBalance - Number(amount);
    await userWallet.save();
    await transaction.save();
    res.status(202).json({
      message: "transaction is being processed",
      balance: userWallet.current_balance,
      success: true,
    });
  } catch (error) {
    return res.status(422).json({
      message: "failed transaction",
      success: false,
    });
  }
};

module.exports = {
  fetchDataPrices,
  buyData,
};
