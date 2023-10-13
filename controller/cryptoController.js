const fs = require("fs");
const { generateTransId } = require("../utils");
const Trades = require("../model/Trades");
const Transaction = require("../model/Transaction");
const TradePlan = require("../model/TradePlan");

const sellCrypto = async(req, res)=>{
    const user = req.user;

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      req.flash("error", "Payment screenshot is missing!");
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err){
          req.flash("error", err);
        }
      })
    }
    const {amount, currency, service_id} = req.body;
    const trade = await fetch(`http://localhost:4000/api/v1/trade_plan/${service_id}`).then(res => res.json())
    let details = await trade.data
    const trade_type = details.trade_type
    const sellPrice = details.dollar_sell_price;
    const userWallet = req.user.wallet;
    const userBalance = userWallet.current_balance;
    const val = Number(amount * sellPrice);

    if(amount < 50){
      req.flash("error", "Minimum trade for crypto is $50")
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
    service: "crypto",
    type: "credit",
    description: `${val} crypto ${service_id} funds sold!`,
    reference_number: transaction_id,
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
    res.json({message: "Error while selling crypto funds"})
   }
    // update transaction to be concluded
    transaction.status = "review";
    transaction.balance_after = userBalance;
    // deduct transaction amount from user wallet
    userWallet.previous_balance = userBalance;
    userWallet.current_balance = userBalance;
    await userWallet.save();
    await transaction.save();
    await soldTrade.save()
    res.status(202).json({
      message: "transaction is being processed",
      balance: userWallet.current_balance,
      success: true,
    });
  } catch (error) {
    transaction.status = "failed"
    return res.status(422).json({
      message: error,
      success: false,
    });
  }
    
}

module.exports = sellCrypto;