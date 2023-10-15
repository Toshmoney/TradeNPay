const axios = require("axios")
require("dotenv").config()
const { formatTransaction, generateTransId} = require("../utils");
const Wallet = require("../model/Wallet");
const Transaction = require("../model/Transaction");

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

const fetchsupportbanks = async(req, res)=>{
    const banks = await fetch('https://api.paystack.co/bank', {
        method:"GET",
        headers:{
            "Authorization":`Bearer ${PAYSTACK_SECRET_KEY}`
        }
    })
    .then(res => res.json())
    .then(data => data.data)
    .catch(err =>{
        console.log(err);
    })

    if(banks){
        return res.status(200).json(banks)
    }
    return;
}

const withdrawalRequest = async(req, res)=>{
    let {accountNmber, bankCode, amount} = req.body
    const user = req.user;
    let account_number = '';
    let account_name = '';
    let bank_code = '';
    let message = ''
    const minimumWithdrawal = Number(10000);
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

        req.flash("error", "amount is missing");
        return res.redirect("/wallet/withdraw");
        
      }
    if(val < minimumWithdrawal){
        req.flash("error", "Minimum withdrawal amount is 10,000 naira");
        return res.redirect("/wallet/withdraw");
    }

if (userBalance < Number(val)){
    req.flash("error", "Insufficient Funds in user wallet!");
    return res.redirect("/wallet/withdraw");
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
        req.flash("error", response?.message);
        return res.redirect("/wallet/withdraw");
        
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

            req.flash("error", "Failed");
            return res.redirect("/wallet/withdraw");
            
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
            req.flash("error", "Transfer could not be completed, please try again later");
            return res.redirect("/wallet/withdraw");
        }

        // res.json(processTransfer)
    
        const amount_paid = Number(amount);
        wallet.previous_balance = userBalance;
        wallet.current_balance = userBalance - Number(amount_paid);
        transaction.status = "completed";
        transaction.balance_after = userBalance - Number(amount_paid);
        await wallet.save();
        await transaction.save();

        req.flash("info", "Withdraw in progress ..");
        return res.redirect("/wallet");

}

};

module.exports = {
    withdrawalRequest,
    fetchsupportbanks
};