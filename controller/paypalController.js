require("dotenv").config();
const { fetchPrices, generateTransId } = require("../utils");
const Transaction = require("../model/Transaction");
const { default: axios } = require("axios");
const Trades = require("../model/Trades");

const buyPaypal = async (req, res) => {
  const {email, full_name, currency, service_id} = req.body;
  let amount = req.body.amount;
  const trade = await fetch(`http://localhost:4000/api/v1/trade_plan/${service_id}`).then(res => res.json())
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
    service: "paypal",
    type: "debit",
    description: `NGN${amount} worth of paypal funds purchased`,
    reference_number: transaction_id,
  });
  
  // send request to server
  try {
   const purchasedtrade = await Trades.create({
    user,
    amount,
    full_name,
    currency,
    service_id,
    trade_type,
    trans_id: transaction_id,
   });
   if(!purchasedtrade){
    res.json({message: "Error while purchasing paypal funds"})
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
    transaction.status = "failed"
    return res.status(422).json({
      message: "failed transaction",
      success: false,
    });
  }
}
};

const sellPaypal = async (req, res) => {

  let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      req.flash("error", "Screenshot image is missing!");
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


  const {trans_id, currency, service_id} = req.body
  let amount = req.body.amount
  const trade = await fetch(`http://localhost:4000/api/v1/trade_plan/${service_id}`).then(res => res.json())
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
    service: "paypal",
    type: "credit",
    description: `NGN${amount} worth of paypal ${service_id} funds sold!`,
    reference_number: transaction_id,
  });
 
  // send request to server
  try {
   const soldTrade = await Trades.create({
    user,
    amount,
    trans_id,
    currency,
    service_id,
    trade_type,
    proof: newImageName,
   });
   if(!soldTrade){
    res.json({message: "Error while purchasing paypal funds"})
   }
    // update transaction to be concluded
    transaction.status = "review";
    transaction.balance_after = userBalance;
    // deduct transaction amount from user wallet
    userWallet.previous_balance = userBalance;
    userWallet.current_balance = userBalance;
    await userWallet.save();
    await transaction.save();
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
  buyPaypal,
  sellPaypal
};
