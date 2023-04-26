require("dotenv").config()
const { default: axios } = require("axios")
const Transaction = require("../model/Transaction")
const Wallet = require("../model/Wallet")

const { generateTransId } = require("../utils")

const recharge = async (req, res) => {
    const user = req.user
    const { service_id, smartCardNumber, productCode, amount } = req.body
    if (!user) {
        return res.status(401).json({
            message: 'user not recognised',
            error: 'authentication'
        })
    }
    if (!service_id) {
        return res.status(400).json({
            message: 'missing provider',
            error: 'service_id'
        })
    }
    if (!smartCardNumber) {
        return res.status(400).json({
            message: 'missing smart card/device number',
            error: 'card'
        })
    }
    // check if user has enough in his wallet
    const userWallet = await Wallet.findOne({ user: user._id })
    if (!userWallet) {
        return res.status(400).json({
            message: 'No wallet for user',
            error: 'wallet'
        })
    }
    if (userWallet.balance < Number(amount)) {
        return res.status(400).json({
            message: 'Insufficient wallet balance',
            error: 'balance'
        })
    }
    // first validate smart card number
    const validationReqData = {
        service_id,
        customerAccountId: smartCardNumber

    }
    let validateResponse;
    let validateResponseData = {};
    let customerDetails;
    console.log('validation started');
    try {
        validateResponse = await axios.post(
            'https://enterprise.mobilenig.com/api/services/proxy',
            validationReqData,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.API_PUBLIC_KEY}`,
                    "Content-Type": 'application/json' 
                }
            }
        )
        validateResponseData = validateResponse.data
        customerDetails = validateResponseData.details
        if (validateResponseData.message !== 'success' || !customerDetails || typeof customerDetails !== 'object') {
            console.log('validation failed');
            return res.status(400).json({
                message: 'failed',
                error: 'validation'
            })
        }
        console.log(validateResponseData, customerDetails);
    } catch (error) {
        console.log(error);
        return res.status(422).json({
            message: 'failed',
            error: 'validation'
        })
    }
    console.log('validation completd');
    // create a unique transaction_id
    let transaction_id;
    while (true) {
        transaction_id = generateTransId()
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
        description: `tv purchase for ${smartCardNumber}`,
        reference_number: transaction_id
    })
    // If validation is successful make data to proceed to purchase
    const rechargeRequestData = {
        ...validateResponseData.details,
        trans_id: transaction_id,
        service_id,
        productCode,
        amount: Number(amount)
    }
    console.log('recharge request data: ', rechargeRequestData);
    try {
        // send request to purchase
        console.log('purchase started');
        const rechargeResponse = await axios.post(
            'https://enterprise.mobilenig.com/api/services/', 
            rechargeRequestData,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.API_SECRET_KEY}`,
                    "Content-Type": 'application/json'
                }
            }
        )
        const rechargeResponseData = rechargeResponse.data
        console.log(rechargeResponseData);
        if (rechargeResponseData.message !== 'success') {
            console.log('purchase failed');
            return res.status(400).json({
                message: 'failed',
                error: 'recharge'
            })
        }
        console.log('purchase completed');
        // update transaction to be concluded
        transaction.status = 'completed'
        // deduct transaction amount from user wallet
        userWallet.balance = userWallet.balance - Number(amount)
        await userWallet.save()
        await transaction.save()
        res.status(202).json({
            message: 'your transaction is being processed',
            balance: userWallet.balance
        })
    } catch (error) {
        console.log(error);
        return res.status(422).json({
            message: 'failed',
            error: 'validation'
        })
    }
}

module.exports = {
    rechargeTv: recharge
}