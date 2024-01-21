require("dotenv").config()
const fs = require("fs");
const { generateTransId } = require("../utils");
const Trades = require("../model/Trades");
const Transaction = require("../model/Transaction");
const nodemailer = require("nodemailer");
const baseurl = process.env.BASE_URL



const sellGiftcard = async(req, res)=>{
    const user = req.user;

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      req.flash("error", "Giftcard image is missing!");
    }

    const proof = req.files?.proof;
    if (!proof) {
      throw new CustomAPIError("file is missing", StatusCodes.BAD_REQUEST);
    }
    else {

      imageUploadFile = req.files.proof;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err){
          req.flash("error", err);
        }
      })

    }


    const {amount, currency, service_id} = req.body;
    const trade = await fetch(`${baseurl}/api/v1/trade_plan/${service_id}`).then(res => res.json())
    let details = await trade.data
    const trade_type = details.trade_type
    const sellPrice = details.dollar_sell_price;
    const userWallet = req.user.wallet;
    const userBalance = userWallet.current_balance;
    const val = Number(amount * sellPrice);

    if(amount < 20){
      req.flash("error", "Minimum amount you can sell is $20");
    }

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
    amount: val,
    balance_before: userBalance,
    balance_after: userBalance,
    status: "pending",
    service: "giftcard",
    type: "credit",
    description: `$${amount} giftcard ${service_id} funds sold!`,
    reference_number: transaction_id,
    proof:newImageName
  });
 
  // send request to server
  try {
   const soldTrade = Trades.create({
    user,
    amount,
    currency,
    service_id,
    trade_type,
    proof:newImageName,
    trans_id: transaction_id,
   });
   if(!soldTrade){
    req.flash("error", "Error while selling giftcard funds");
    res.redirect("/trades/giftcard")
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
    // res.status(202).json({
    //   message: "transaction is being processed",
    //   balance: userWallet.current_balance,
    //   success: true,
    // });
    
    req.flash("info", "transaction is being processed");
    res.redirect("/trades/giftcard")

  } catch (error) {
    transaction.status = "failed"
    // return res.status(422).json({
    //   message: "failed transaction",
    //   success: false,
    // });

    req.flash("error", "Failed Transaction!");

    res.redirect("/trades/giftcard")

  }
    
}

module.exports = sellGiftcard;