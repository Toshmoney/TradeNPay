const { dashboardData } = require("../utils/dashboardData")

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
