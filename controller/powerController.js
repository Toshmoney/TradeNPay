require("dotenv").config()
const { default: axios } = require("axios")
const Transaction = require("../model/Transaction")

const { generateTransId } = require("../utils")

const recharge = async (req, res) => {
    const user = req.user
    const { service_id, meterNumber, amount, phoneNumber, email } = req.body
    if (!service_id) {
        return res.status(400).json({
            message: 'missing provider',
            error: 'service_id'
        })
    }
    if (!meterNumber) {
        return res.status(400).json({
            message: 'missing meter number',
            error: 'meter'
        })
    }
    // check if user has enough in his wallet
    const userWallet = req.user.wallet

    console.log('validation started');
    // first validate smart card number
    const customerDetails = req.customerDetails
    console.log('validation succesful');
    
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
        description: `electricity purchase for ${meterNumber}`,
        reference_number: transaction_id
    })
    // If validation is successful make data to proceed to purchase
    const customerName = `${customerDetails.firstName} ${customerDetails.lastName}` || ""
    const rechargeRequestData = {
        service_id,
        trans_id: transaction_id,
        meterNumber,
        customerNumber: meterNumber,
        customerReference: meterNumber, // account number of the customer
        customerPhoneNumber: phoneNumber,
        customerMobileNumber: phoneNumber,
        customerPhone: phoneNumber,
        customerEmail: email,
        customerName,
        contactType: 'LANDLORD',
        email: email,
        phoneNumber,
        tariffCode: meterNumber,
        thirdPartyCode: '',
        serviceBand: "",
        amount: Number(amount),
        ...customerDetails,
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
        if (rechargeResponseData.message !== 'success' || !rechargeResponseData.details || typeof rechargeResponseData.details !== 'object') {
            console.log('purchase failed');
            return res.status(400).json({
                message: `${rechargeResponseData.details || 'Unable to process request'}`,
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
            message: 'Unable to process request',
            error: 'validation'
        })
    }
}

module.exports = {
    rechargeElectricity: recharge
}