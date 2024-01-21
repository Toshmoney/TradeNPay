require("dotenv").config()
const { generateTransId } = require("../utils");
const Transaction = require("../model/Transaction");
const { default: axios } = require("axios");
const Trades = require("../model/Trades");
const nodemailer = require("nodemailer");

const baseurl = process.env.BASE_URL; 
const buyPayoneer = async (req, res) => {
  // const { amount, beneficiary, email, code, service_id, service_type } = req.body;
  const {email, full_name, currency, service_id} = req.body;
  let amount = req.body.amount
  const trade = await fetch(`${baseurl}/api/v1/trade_plan/${service_id}`).then(res => res.json())
  let details = await trade.data
  const trade_type = details.trade_type
  const buyPrice = details.dollar_buy_price;

  const user = req.user;
  const userWallet = req.user.wallet;
  const userBalance = userWallet.current_balance;
  amount = Number(amount * buyPrice);

  if (userBalance < Number(amount)){
    // req.flash('error', 'Insufficient funds!')
    // return  res.redirect('/trades/paypal')
    res.json({"error": "Insufficient Funds in user wallet!"})
  }else{
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
    amount: amount,
    balance_before: userBalance,
    balance_after: userBalance,
    status: "pending",
    service: "payoneer",
    type: "debit",
    description: `NGN${amount} payoneer funds purchased for ${email}`,
    reference_number: transaction_id,
  });
 
  // send request to server
  try {
   const purchasedtrade = Trades.create({
    user,
    amount,
    full_name,
    currency,
    service_id,
    trade_type,
    trans_id: transaction_id,
   });
   if(!purchasedtrade){
    res.json({message: "Error while purchasing payoneer funds"})
   }
    // update transaction to be concluded
    transaction.status = "review";
    transaction.balance_after = userBalance - Number(amount);
    // deduct transaction amount from user wallet
    userWallet.previous_balance = userBalance;
    userWallet.current_balance = userBalance - Number(amount);
    await userWallet.save();
    await transaction.save();
    // await purchasedtrade.save()
    res.status(202).json({
      message: "transaction is being processed",
      balance: userWallet.current_balance,
      success: true,
    });
  } catch (error) {
    transaction.status = "failed"
    return res.status(422).json({
      message: "failed transaction",
      success: false,
    });
  }
}
};

const sellPayoneer = async (req, res) => {
  const {full_name, currency, service_id} = req.body;

  let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      req.flash("error", "Screenshot image is missing!");
    } else {

      imageUploadFile = req.files.proof;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err){
          req.flash("error", err);
          console.log(err);
        }
      })

    }
    
  let amount = req.body.amount;
  const trade = await fetch(`${baseurl}/api/v1/trade_plan/${service_id}`).then(res => res.json())
  let details = await trade.data
  const trade_type = details.trade_type
  const sellPrice = details.dollar_sell_price;
  const user = req.user;
  const userWallet = req.user.wallet;
  const userBalance = userWallet.current_balance;
  amount = Number(amount * sellPrice);
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
    amount: amount,
    balance_before: userBalance,
    balance_after: userBalance,
    status: "pending",
    service: "payoneer",
    type: "credit",
    description: `NGN${amount} payoneer funds sold!`,
    reference_number: transaction_id,
  });
 
  // send request to server
  try {

   const soldTrade = Trades.create({
    user,
    amount,
    full_name,
    currency,
    service_id,
    trade_type,
    trans_id: transaction_id,
   });
   if(!soldTrade){
    res.json({message: "Error while purchasing payoneer funds"})
   }

   // Use Nodemailer to notify admin via email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: 'info@paytonaira.com',
    subject: "New Trade awaiting Approval",
    text: `Dear admin, a new trade of NGN${amount} was done and is waiting for your approval!`,
  };

  transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
        req.flash("error", "Error while sending Notification to user");
        return res.redirect("/admin");
      }
    });
    
    // update transaction to be concluded
    transaction.status = "review";
    transaction.balance_after = userBalance;
    // deduct transaction amount from user wallet
    userWallet.previous_balance = userBalance;
    userWallet.current_balance = userBalance;
    await userWallet.save();
    await transaction.save();
    // await soldTrade.save()
    res.status(202).json({
      message: "transaction is being processed",
      balance: userWallet.current_balance,
      success: true,
    });
  } catch (error) {
    transaction.status = "failed"
    return res.status(422).json({
      message: "failed transaction",
      success: false,
    });
  }
};


module.exports = {
  buyPayoneer,
  sellPayoneer
};
