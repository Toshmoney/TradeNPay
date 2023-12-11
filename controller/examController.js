require("dotenv").config();
const { default: axios } = require("axios");
const Transaction = require("../model/Transaction");
const { generateTransId } = require("../utils");

const recharge = async (req, res) => {
  const user = req.user;
  const { service_id, amount, quantity } = req.body;

  if (!service_id) {
    return res.status(400).json({
      message: "missing provider",
      success: false,
    });
  }

  const userWallet = req.user.wallet;
  const userBalance = userWallet.current_balance;

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
    balance_before: userBalance,
    balance_after: userBalance,
    amount: Number(amount),
    status: "pending",
    service: "exam",
    type: "debit",
    description: `Result checker purchase`,
    reference_number: transaction_id,
  });
  // If validation is successful make data to proceed to purchase
  const rechargeRequestData = {
    service_id,
    trans_id: transaction_id,
    quantity,
    amount: Number(amount),
  };
  console.log("recharge request data: ", rechargeRequestData);
  try {
    // send request to purchase
    console.log("purchase started");
    const rechargeResponse = await axios.post(
      "https://enterprise.mobilenig.com/api/services/",
      rechargeRequestData,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const rechargeResponseData = rechargeResponse.data;
    console.log(rechargeResponseData);
    if (rechargeResponseData.message !== "success") {
      console.log("purchase failed");
      return res.status(400).json({
        message: rechargeResponseData.details,
        success: "false",
      });
    }
    console.log("purchase completed");
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
    console.log(error);
    return res.status(422).json({
      message: "failed",
      success: false,
    });
  }
};

module.exports = {
  buyExamPin: recharge,
};
