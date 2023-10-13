require("dotenv").config();
const { default: axios } = require("axios");
const { formatTransaction } = require("../utils");

const Transaction = require("../model/Transaction");
const Wallet = require("../model/Wallet");

const fundWallet = async (req, res) => {
  const user = req.user;
  const { amount, reference } = req.body;
  if (!amount || !reference) {
    return res.status(400).json({
      message: "reference or amount is missing",
      success: false,
    });
  }
  let wallet = await Wallet.findOne({ user: user });
  if (!wallet) {
    wallet = new Wallet({
      user: user,
      current_balance: 0,
      previous_balance: 0,
    });
  }
  const userBalance = wallet.current_balance;
  const transaction = new Transaction({
    user: req.user,
    balance_before: userBalance,
    balance_after: userBalance,
    amount: amount / 100,
    service: "wallet",
    type: "credit",
    status: "pending",
    description: `wallet funding with ${amount / 100}`,
    reference_number: reference,
  });
  // call paystack  api to confirm payment
  let trans_id = "";
  try {
    const payment = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    const { data } = payment;
    if (data?.status === false) {
      transaction.status = "failed";
      transaction.description = "paystack payment verification failed";
      await transaction.save();
      return res.status(422).json({
        message: "verification failed",
        success: false,
      });
    }
    const payment_data = data.data;
    trans_id = payment_data.id;
    transaction.external_id = trans_id;
    if (payment_data.status !== "success") {
      transaction.description = "paystack payment verification failed";
      await transaction.save();
      return res.status(422).json({
        message: "verification failed",
        success: false,
      });
    }
  } catch (error) {
    const message = "paystack payment verification failed";
    transaction.external_id = trans_id;
    transaction.status = "failed";
    transaction.description = "payment verification failed";
    await transaction.save();
    return res.status(422).json({
      message: message,
      success: false,
    });
  }

  const amount_paid = Number(amount / 100);
  wallet.previous_balance = userBalance;
  wallet.current_balance = userBalance + amount_paid;
  transaction.status = "completed";
  transaction.balance_after = userBalance + amount_paid;
  await wallet.save();
  await transaction.save();
  res.status(200).json({
    message: "Verification successful",
    status: true,
    data: {
      balance: wallet.current_balance,
      transaction: formatTransaction(transaction),
    },
  });
};

module.exports = fundWallet;
