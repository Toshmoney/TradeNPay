const User = require("../model/User.db")
const homePage = async (req, res)=>{
    res.status(200).render("pages/home")
}
const signIn = async (req, res)=>{
    res.status(200).render("pages/signin")
}

const test = async (req, res)=>{
    res.status(200).json({msg: "testing new data"})
}
const signUp = async (req, res)=>{
    // const {data} = req.query
    // await User.create(data)
    res.status(200).render("pages/signup")
}
const signOut = async (req, res)=>{
    res.status(200).redirect("/sign-in")
}
const dashboard = async (req, res)=>{
    res.status(200).render("dashboard/dashboard")
}
const airtime = (req, res)=>{
    res.status(200).render("dashboard/airtime")
};
const dataplan = (req, res)=>{
    res.status(200).render("dashboard/dataplan")
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
module.exports = {homePage, signIn, signUp, signOut, dashboard, airtime, dataplan, billpayment, wallet,
fundWallet, receiveWallet, setting, verifyNow, profile, test}