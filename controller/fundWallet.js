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
      message: "reference or is missing",
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
  try {
    const payment = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
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
  } catch (error) {
    let message = "paystack payment verification failed";
    if (error.response) {
    } else if (error.request) {
      message = "unable to verify payment";
    } else {
      message = "error in setting up request to verify payment";
    }
    transaction.status = "failed";
    transaction.description = "paystack payment verification failed";
    await transaction.save();
    return res.status(422).json({
      message: message,
      success: false,
    });
  }

  wallet.previous_balance = userBalance;
  wallet.current_balance += amount / 100;
  transaction.status = "completed";
  transaction.balance_after = userBalance + amount / 100;
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
