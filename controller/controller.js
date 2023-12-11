require("dotenv").config();
const key = process.env.PAYSTACK_PUBLIC_KEY;
const secrete = process.env.secrete;
const { dashboardData } = require("../utils/dashboardData");
const { formatPlan } = require("../utils");
const DataPlan = require("../model/DataPlan");
const User = require('../model/User.db');
const { CustomAPIError } = require("../handleError");
const { StatusCodes } = require("http-status-codes");
const { default: axios } = require("axios");


const homePage = async (req, res) => {
  const user = req?.user
  res.status(200).render("pages/home", {user});
};

const dashboard = async (req, res) => {
  const data = await dashboardData(req.user);
  res.status(200).render("dashboard/dashboard", data);
};

const airtime = async (req, res) => {
  const data = await dashboardData(req.user);
  res.status(200).render("dashboard/airtime", data);
};

const dataplan = async (req, res) => {
  const data = await dashboardData(req.user);
  try {
    let plans = await DataPlan.find({ network_id: "1" });
    plans = plans.map((plan) => formatPlan(plan));
    data.plans = plans;
  } catch (error) {
    console.log(error);
  } finally {
    res.status(200).render("dashboard/dataplan", data);
  }
};

const billpayment = (req, res) => {
  res.status(200).render("dashboard/billpayment");
};

const trades = (req, res) => {
  res.status(200).render("dashboard/trades");
};

const billPayer = async (req, res) => {
  const data = await dashboardData(req.user);
  const urlParams = req.params;
  const service = urlParams.service;
  if (service === "electricity") {
    return res.status(200).render("dashboard/electricity", data);
  }
  if (service === "tv") {
    return res.status(200).render("dashboard/tv", data);
  }
  if (service === "exam") {
    return res.status(200).render("dashboard/exam", data);
  }
  return res.status(404).json({
    message: "page you are looking for does not exist",
  });
};

// Customized Trade url
const tradeService = async (req, res) => {
  const data = await dashboardData(req.user);
  const errorMg = req.flash("error").join(" ");
  const infoMg = req.flash("info").join(" ");
  const messages = {
    error: errorMg,
    info: infoMg,
  };
  const urlParams = req.params;
  const service = urlParams.service;
  if (service === "paypal") {
    return res.status(200).render("dashboard/paypal", {data, messages});
  }
  if (service === "payoneer") {
    return res.status(200).render("dashboard/payoneer", {data, messages});
  }
  if (service === "giftcard") {
    return res.status(200).render("dashboard/giftcard", {data, messages});
  }
  if (service === "crypto") {
    return res.status(200).render("dashboard/crypto", {data, messages});
  }
  return res.status(404).json({
    message: "page you are looking for does not exist",
  });
};

const wallet = async (req, res) => {
  const data = await dashboardData(req.user);
  res.status(200).render("dashboard/wallet", data);
};
const fundWallet = (req, res) => {
  res.status(200).render("dashboard/fundwallet", {
    key: key,
    name: req.user.name,
    email: req.user.email,
  });
};

const walletWithdraw = async(req, res) => {

  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

    const banks = await axios.get('https://api.paystack.co/bank', {
        headers:{
            "Authorization":`Bearer ${PAYSTACK_SECRET_KEY}`
        }
    })
    .then(data => data.data.data)
    .catch(err =>{
        console.log(err);
    })

  const errorMg = req.flash("error").join(" ");
  const infoMg = req.flash("info").join(" ");
  const messages = {
    error: errorMg,
    info: infoMg,
  };

  res.status(200).render("dashboard/withdraw", {msg : messages, secrete: secrete, banks});
};


const verifyNow = (req, res) => {
  res.status(200).render("dashboard/verifynow");
};
const setting = async (req, res) => {
  const data = await dashboardData(req.user);
  const {user} = data
  res.status(200).render("dashboard/setting", {user});
};
const profile = async (req, res) => {
  const data = await dashboardData(req.user);
  const {user} = data;
  const {name, email, phoneNumber} = data?.user
  res.status(200).render("dashboard/profile", { user, name, email, tel: phoneNumber});
};



const privacyPolicy = async (req, res) => {
  res.status(200).render("dashboard/privacy");
};

const businessBal = async (req, res) => {
  const data = await dashboardData(req.user);
  res.status(200).render("admin/businessbal", data);
};



const aboutPage = async (req, res) => {
  const user = req?.user
  res.status(200).render("pages/about-us", {user});
};

const blog = async (req, res) => {
  const user = req?.user
  res.status(200).render("pages/blog", {user});
};

const contact = async (req, res) => {
  const user = req?.user
  res.status(200).render("pages/contact", {user});
};

const support = async (req, res) => {
  const user = req?.user
  res.status(200).render("pages/support", {user});
};

const termsCondition = async (req, res) => {
  const user = req?.user
  res.status(200).render("pages/terms-condition", {user});
};
module.exports = {
  homePage,
  dashboard,
  airtime,
  dataplan,
  billpayment,
  wallet,
  fundWallet,
  setting,
  verifyNow,
  profile,
  billPayer,
  privacyPolicy,
  businessBal,
  tradeService,
  trades,
  walletWithdraw,

  aboutPage,
  blog,
  contact,
  support,
  termsCondition
};
