const Wallet = require("../model/Wallet")
const Transaction = require("../model/Transaction")

const formatTransactionDate = (date_string) => {
    const trans_date = new Date(date_string)
    const year = trans_date.getFullYear()
    let month = trans_date.getMonth() + 1
    let day = trans_date.getDate()
    if (month < 10) {
        month = `0${month}`
    }
    if (day < 10) {
        day = `0${day}`
    }
    return `${year}-${month}-${day}`
}

const fetchUserTransactions = async (userId, limit=20) => {
    let transactions = await Transaction.find({user: userId})
    .sort('-createdAt')
    .limit(limit)
    if (transactions.length === 0) {
        return []
    }
    transactions = transactions.map(transaction => {
        const item = transaction.toObject()
        return {
            ...item,
            createdAt: formatTransactionDate(item.createdAt),
            updatedAt: formatTransactionDate(item.updatedAt),
        }
    })
    return transactions
}

const dashboardData = async (user) => {
    const userWallet = await Wallet.findOne({
        user: user._id
    })
    const userTransactions = await fetchUserTransactions(user._id)
    const user_data = {
        name: user.name,
        email: user.email,
    }
    const data = {
        user: user_data,
        transactions: userTransactions
    }
    if (userWallet) {
        user_data.balance = userWallet.balance
        data.balance = userWallet.balance
    }
    return data
}

const {
    fetchPrices
} = require('../utils')
const homePage = async (req, res)=>{
    res.status(200).render("pages/home")
}
const test = async (req, res)=>{
    res.status(200).json({msg: "testing new data"})
}

const dashboard = async (req, res) => {
    const data = await dashboardData(req.user)
    res.status(200).render("dashboard/dashboard", data)
}

const airtime = async (req, res) => {
    const data = await dashboardData(req.user)
    res.status(200).render("dashboard/airtime", data)
};

const dataplan = async (req, res) => {
    const data = await dashboardData(req.user)
    try {
        const priceDetails = await fetchPrices()
        data.details = priceDetails
    } catch (error) {
        console.log(error);
    }
    finally {
        res.status(200).render("dashboard/dataplan", data)
    }
};
const billpayment = (req, res)=>{
    res.status(200).render("dashboard/billpayment")
}

const billPayer = async(req, res) => {
    // get url parameters and query
    // use those to customize requested page
    const data = await dashboardData(req.user)
    const urlParams = req.params
    const service = urlParams.service
    if (service === 'electricity') {
        return res.status(200).render("dashboard/electricity", data)
    }
    if (service === 'tv') {
        return res.status(200).render("dashboard/tv", data)
    }
    if (service === 'exam') {
        return res.status(200).render("dashboard/exam", data)
    }
    return res.status(404).json({
        message: 'page you are looking for does not exist'
    })
}

const wallet = async (req, res) => {
    const data = await dashboardData(req.user)
    res.status(200).render("dashboard/wallet", data)
};
const fundWallet = (req, res)=>{
    res.status(200).render("dashboard/fundwallet")
};

const receiveWallet = (req, res)=>{
    res.status(200).render("dashboard/receive")
};
const verifyNow = (req, res) => {
    res.status(200).render("dashboard/verifynow")
};
const setting = (req, res) => {
    res.status(200).render("dashboard/setting")
};
const profile = (req, res) => {
    res.status(200).render("dashboard/profile")
};

module.exports = {
    homePage, dashboard, airtime, dataplan, billpayment, wallet,
    fundWallet, receiveWallet, setting, verifyNow, profile, test, billPayer
}
