const axios = require("axios")
require("dotenv").config()
const { formatTransaction, generateTransId} = require("../utils");
const Wallet = require("../model/Wallet");
const Transaction = require("../model/Transaction");

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const verifybank = async(req, res)=>{
    let {accountNmber, bankCode, amount, email} = req.body
    const user = req.user;
    let account_number = '';
    let account_name = '';
    let bank_code = '';
    let message = ''
    const minimumWithdrawal = 10000;
    let val = Number(amount);


    let wallet = await Wallet.findOne({ user: user });
    if (!wallet) {
        wallet = new Wallet({
        user: user,
        current_balance: 0,
        previous_balance: 0,
        });
    }
    const userBalance = wallet.current_balance;

    if (!amount || !accountNmber) {
        return res.status(400).json({
          message: "account number or amount is missing",
          success: false,
        });
      }

    if(val < minimumWithdrawal){
        return res.status(400).json({
            message: "Minimum withdrawal amount is 10,000 naira!",
            success: false,
          });
    }

if (userBalance < Number(val)){
    res.json({"error": "Insufficient Funds in user wallet!"})
    }else{

    // create unique transaction id
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

    const transaction = new Transaction({
        user: req.user,
        balance_before: userBalance,
        balance_after: userBalance,
        amount: amount,
        service: "wallet",
        type: "debit",
        status: "pending",
        description: `${amount} withdrawal from wallet`,
        reference_number: transaction_id,
    });

    // let trans_id = "";

// Endpoint to verify users account number
    const verifybankUrl = `https://api.paystack.co/bank/resolve?account_number=${accountNmber}&bank_code=${bankCode}`;
    const response = await fetch(verifybankUrl, {
        method:"GET",
        headers:{
          "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
        }
      })
      .then(info => info.json())
    
      if(response.status === false){
        transaction.status = "failed";
        transaction.description = "paystack withdrawal bank verification failed";
        await transaction.save();
        return res.status(422).json({
            message: response.message,
            success: false
        })
      }

        bank_code = response.data.bank_code;
        account_number = response.data.account_number;
        account_name = response.data.account_name;

    // proceed with creating transfer

    const transData = {
        "bank_code":bankCode,
        "account_number":account_number,
        "name":account_name,
        "type": "nuban",
        "currency": "NGN"
    }

    const trasnferDetails = await fetch("https://api.paystack.co/transferrecipient",{
            method:"POST",
            headers:{
            "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(transData)            
        })
        .then(res => res.json())

        if(trasnferDetails.status === false){
            return res.status(422).json({
                message:"Failed",
                success: false
            })
        }

        const recipient_code = trasnferDetails.data.recipient_code;

        const data = {
            "source": "balance",
            "amount": amount * 100,
            "reference": transaction_id,
            "recipient": recipient_code,
            "reason": "Funds withdrawal"
        }

        const processTransfer = await fetch("https://api.paystack.co/transfer",{
            method:"POST",
            headers:{
            "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)            
        })
        .then(res => res.json())

        if(processTransfer.status === false){
            res.status(422).json({
                message:"Transfer could not be completed, please try again later",
                success: false
            })
        }

        // res.json(processTransfer)
    
        const amount_paid = Number(amount);
        wallet.previous_balance = userBalance;
        wallet.current_balance = userBalance - Number(amount_paid);
        transaction.status = "completed";
        transaction.balance_after = userBalance - Number(amount_paid);
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

}

};

module.exports = {verifybank};