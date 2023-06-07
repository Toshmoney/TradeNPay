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
      status: false,
    });
  }
  let wallet = await Wallet.findOne({ user: user });
  if (!wallet) {
    wallet = new Wallet({
      user: user,
      balance: 0,
    });
  }
  const transaction = new Transaction({
    user: req.user,
    wallet: wallet,
    amount: amount / 100,
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
      console.log("paystack payment verification failed");
      console.log(data);
      transaction.status = "failed";
      transaction.description = "paystack payment verification failed";
      await transaction.save();
      return res.status(422).json({
        message: "verification failed",
        status: false,
      });
    }
  } catch (error) {
    let message = "paystack payment verification failed";
    let status = 500;
    if (error.response) {
      status = error.response.status || 400;
      console.log(error.response.data || message);
    } else if (error.request) {
      status = 422;
      message = "unable to verify payment";
      console.log(error.request.data || message);
    } else {
      message = "error in setting up request to verify payment";
      console.log(message);
    }
    transaction.status = "failed";
    transaction.description = "paystack payment verification failed";
    await transaction.save();
    return res.status(422).json({
      message: message,
      status: status,
    });
  }

  wallet.balance += amount / 100;
  transaction.status = "completed";
  await wallet.save();
  await transaction.save();
  res.status(200).json({
    message: "Verification successful",
    status: true,
    data: {
      current_balance: wallet.balance,
      transaction: formatTransaction(transaction),
    },
  });
};

module.exports = fundWallet;
