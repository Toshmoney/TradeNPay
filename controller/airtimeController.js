require("dotenv").config();
const { generateTransId } = require("../utils");
const Transaction = require("../model/Transaction");
const { default: axios } = require("axios");

const buyAirtime = async (req, res) => {
  const { amount, phoneNumber, service_id, service_type } = req.body;
  const user = req.user;
  // check if user has enough in his wallet
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
    service: "airtime",
    type: "debit",
    description: `airtime purchase for ${phoneNumber}`,
    reference_number: transaction_id,
  });
  // form request data
  const req_data = {
    amount: Number(amount),
    phoneNumber,
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
        message: "unable to process transaction, pls check your inputs ",
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
      message: "your transaction is being processed",
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
  buyAirtime,
};
