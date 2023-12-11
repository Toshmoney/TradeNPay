require("dotenv").config();
const { default: axios } = require("axios");
const { formatTransaction } = require("../utils");
const nodemailer = require("nodemailer");
const ejs = require('ejs');
const fs = require('fs');
const Transaction = require("../model/Transaction");
const Wallet = require("../model/Wallet");
const User = require("../model/User.db")

const addFundsManually = async (req, res) => {
  const { amount, email, reference } = req.body;
  if (!amount || !email) {
    return res.status(400).json({
      message: "user email or amount is missing",
      success: false,
    });
  }
  let useracc = await User.findOne({email})
  const user = useracc._id;
  const name = useracc.name
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
    amount: amount,
    service: "wallet",
    type: "credit",
    status: "pending",
    description: `Manual wallet funding with N${amount}`,
    reference_number: reference,
  });

     // Create a Nodemailer transporter
     const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      // Load the EJS template and CSS file
      const emailTemplate = ejs.compile(fs.readFileSync('views/pages/fundnotify.ejs', 'utf8'));
      // const cssStyles = fs.readFileSync('public/css/email.css', 'utf8');
  
      // Define the email content
      const emailContent = emailTemplate({ amount, name});
  
      // Create the email data
      const mailOptions = {
        from: 'paytonaira@gmail.com',
        to: email,
        subject: 'Manual Funding',
        html: emailContent
        // attachments: [
        //   {
        //     filename: 'email.css',
        //     content: cssStyles,
        //   },
        // ],
      };
  
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Email sent:', info.response);
        }
      });

  const amount_paid = Number(amount);
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

module.exports = addFundsManually;
