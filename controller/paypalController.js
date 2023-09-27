require("dotenv").config();
const { fetchPrices, generateTransId } = require("../utils");
const Transaction = require("../model/Transaction");
const { default: axios } = require("axios");
const Trades = require("../model/Trades");

// const fetchDataPrices = async (req, res) => {
//   const { service_id, requestType } = req.body;
//   try {
//     const details = await fetchPrices(service_id, requestType);
//     return res.status(200).json(details);
//   } catch (error) {
//     return res.status(500).json({
//       message: "unable to handle error",
//     });
//   }
// };

const buyPaypal = async (req, res) => {
  // const { amount, beneficiary, email, code, service_id, service_type } = req.body;
  const {email, amount, full_name, trade_type, currency, service_id} = req.body
  const user = req.user;
  const userWallet = req.user.wallet;
  const userBalance = userWallet.current_balance;
  let val = Number(amount);

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
    service: "paypal",
    type: "debit",
    description: `${amount} paypal funds purchased for ${email}`,
    reference_number: transaction_id,
  });
  // form request data
  const req_data = {
    amount,
    full_name,
    currency,
    service_id,
    trade_type,
    trans_id: transaction_id,
  };
  // send request to server
  try {
   const purchasedtrade = new Trades({
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
    transaction.status = "review";
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
  const {email, amount, full_name, trade_type, currency, service_id} = req.body
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
    service: "paypal",
    type: "credit",
    description: `${amount} paypal ${service_id} funds sold!`,
    reference_number: transaction_id,
  });
 
  // send request to server
  try {
   const soldTrade = new Trades({
    amount,
    full_name,
    currency,
    service_id,
    trade_type,
    trans_id: transaction_id,
   });
   if(!soldTrade){
    res.json({message: "Error while purchasing paypal funds"})
   }
    // update transaction to be concluded
    transaction.status = "review";
    transaction.balance_after = userBalance + Number(val);
    // deduct transaction amount from user wallet
    userWallet.previous_balance = userBalance;
    userWallet.current_balance = userBalance + Number(val);
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
