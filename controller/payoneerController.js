const { generateTransId } = require("../utils");
const Transaction = require("../model/Transaction");
const { default: axios } = require("axios");
const Trades = require("../model/Trades");

const buyPayoneer = async (req, res) => {
  // const { amount, beneficiary, email, code, service_id, service_type } = req.body;
  const {email, amount, full_name, currency, service_id} = req.body
  const user = req.user;
  const userWallet = req.user.wallet;
  const userBalance = userWallet.current_balance;
  let val = Number(amount);
  const trade_type = 'payoneer'

  if (userBalance < Number(val)){
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
    amount: val,
    balance_before: userBalance,
    balance_after: userBalance,
    status: "pending",
    service: "payoneer",
    type: "debit",
    description: `${amount} payoneer funds purchased for ${email}`,
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
  const {amount, full_name, currency, service_id} = req.body;
  const trade_type = 'payoneer'
  const user = req.user;
  const userWallet = req.user.wallet;
  const userBalance = userWallet.current_balance;
  let val = Number(amount);
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
    service: "payoneer",
    type: "credit",
    description: `${amount} payoneer ${service_id} funds sold!`,
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
