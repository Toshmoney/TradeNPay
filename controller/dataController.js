require('dotenv').config()
const { fetchPrices } = require("../utils")
const Wallet = require('../model/Wallet')
const Transaction = require("../model/Transaction")
const { default: axios } = require("axios")

const fetchDataPrices = async ( req, res ) => {
    const {
        service_id,
        requestType
    } = req.body
    try {
        const details = await fetchPrices(service_id, requestType)
        return res.status(200).json(details)
    } 
    catch (error) {
        return res.status(500).json({
            message: 'unable to handle error'
        })
    }
}

const buyData = async (req, res) => {
    const {
        amount,
        beneficiary,
        code,
        service_id,
        service_type
    } = req.body
    const user = req.user
    // check if user has enough in his wallet
    const userWallet = await Wallet.findOne({ user: user._id })
    if (!userWallet || userWallet.balance < Number(amount)) {
        return res.status(400).json({
            message: 'not enough in your wallet'
        })
    }

    // create a unique transaction_id
    let transaction_id;
    while (true) {
        const timestamp = new Date().getTime().toString()
        const randomNumber = Math.floor(Math.random() * 9000) + 1000;
        transaction_id =  timestamp + randomNumber
        const existingTrans = await Transaction.findOne({ reference_number: transaction_id })
        if (!existingTrans) {
            break
        }
    }
    // create transaction with pending status
    const transaction = new Transaction({
        user: user._id,
        wallet: userWallet,
        amount: Number(amount),
        status: 'pending',
        type: 'debit',
        description: `data purchase for ${beneficiary}`,
        reference_number: transaction_id
    })
    const req_data = {
        amount,
        beneficiary,
        code,
        service_id,
        service_type,
        trans_id: transaction_id
    }
    try {
        // const response = axios.post('https://enterprise.mobilenig.com/api/services/', req_data,
        // { 
        //     headers: {
        //         'Authorization': `Bearer ${process.env.API_PUBLIC_KEY}`,
        //         "Content-Type": 'application/json' 
        //     }
        // }
        // )
        // const { data } = response
        // console.log(data);

        // update transaction to be concluded
        transaction.status = 'completed'
        // deduct transaction amount from user wallet
        userWallet.balance = userWallet.balance - Number(amount)
        console.log('i got here');
        await userWallet.save()
        await transaction.save()
        res.status(202).json({
            message: 'transaction is being processed'
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'failed transaction'
        })
    }
}

module.exports = {
    fetchDataPrices,
    buyData
}