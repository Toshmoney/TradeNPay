const fs = require("fs");
const { generateTransId } = require("../utils");
const Trades = require("../model/Trades");
const Transaction = require("../model/Transaction");


const sellCrypto = async(req, res)=>{
    const user = req.user;

    // const {originalname, path} = req.file;
    // const part = originalname.split(".");
    // const ext = part[part.length - 1];
    // const newPath = `${path}.${ext}`;
    // fs.renameSync(path, newPath)


    const {amount, currency, service_id} = req.body;
    const trade_type = 'crypto'
    const sellPrice = 950;
    const userWallet = req.user.wallet;
    const userBalance = userWallet.current_balance;
    const val = Number(amount);

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
    description: `${amount} giftcard ${service_id} funds sold!`,
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
    // proof:newPath,
    trans_id: transaction_id,
   });
   if(!soldTrade){
    res.json({message: "Error while selling giftcard funds"})
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
    
}

module.exports = sellCrypto;