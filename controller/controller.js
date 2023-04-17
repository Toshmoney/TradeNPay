const User = require("../model/User.db")
const Wallet = require("../model/Wallet")
const Transaction = require("../model/Transaction")

const fetchUserTransactions = async (userId, limit=20) => {
    let transactions = await Transaction.find({user: userId})
    .sort('-createdAt')
    .limit(limit)
    transactions = transactions.map(transaction => transaction.toObject())
    if (transactions) {
        return transactions
    }
    return []
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
    const userWallet = await Wallet.find({
        user: req.user._id
    })
    const userTransactions = await fetchUserTransactions(req.user._id)
    const user = {
        name: req.user.name,
        email: req.user.email,
    }
    if (userWallet) {
        user.balance = userWallet.balance
    }
    const data = {
        user: user,
        transactions: userTransactions
    }
    res.status(200).render("dashboard/dashboard", data)
}

const airtime = (req, res)=>{
    res.status(200).render("dashboard/airtime")
};
const dataplan = async (req, res) => {
    let prices = {}
    try {
        const priceDetails = await fetchPrices()
        prices.details = priceDetails
    } catch (error) {
        console.log(error);
    }
    finally {
        res.status(200).render("dashboard/dataplan", prices)
    }
};
const billpayment = (req, res)=>{
    res.status(200).render("dashboard/billpayment")
}

const wallet =(req, res)=>{
    res.status(200).render("dashboard/wallet")
};
const fundWallet =(req, res)=>{
    res.status(200).render("dashboard/fundwallet")
};

const receiveWallet =(req, res)=>{
    res.status(200).render("dashboard/receive")
};
const verifyNow =(req, res)=>{
    res.status(200).render("dashboard/verifynow")
};
const setting =(req, res)=>{
    res.status(200).render("dashboard/setting")
};
const profile =(req, res)=>{
    res.status(200).render("dashboard/profile")
};

module.exports = {
    homePage, dashboard, airtime, dataplan, billpayment, wallet,
    fundWallet, receiveWallet, setting, verifyNow, profile, test
}
