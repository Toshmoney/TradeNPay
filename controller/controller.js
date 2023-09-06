require("dotenv").config();
const key = process.env.PAYSTACK_PUBLIC_KEY;
const { dashboardData } = require("../utils/dashboardData");
const { formatPlan } = require("../utils");
const DataPlan = require("../model/DataPlan");
const User = require("../model/User.db");
const { subvtu_details } = require("../utils/subvtu");
const Transaction = require("../model/Transaction");

const homePage = async (req, res) => {
  res.status(200).render("pages/home");
};
const test = async (req, res) => {
  res.status(200).json({ msg: "testing new data" });
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

const billPayer = async (req, res) => {
  // get url parameters and query
  // use those to customize requested page
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

const receiveWallet = (req, res) => {
  res.status(200).render("dashboard/receive");
};
const verifyNow = (req, res) => {
  res.status(200).render("dashboard/verifynow");
};
const setting = (req, res) => {
  res.status(200).render("dashboard/setting");
};
const profile = async (req, res) => {
  const data = await dashboardData(req.user);
  const errorMg = req.flash("error").join(" ");
  const infoMg = req.flash("info").join(" ");
  const messages = {
    error: errorMg,
    info: infoMg,
  };
  res.status(200).render("dashboard/profile", { messages, data });
};

const privacyPolicy = async (req, res) => {
  res.status(200).render("dashboard/privacy");
};

// Admin dashboard
const adminDashboard = async (req, res) => {
  const subvtu_ = await subvtu_details();
  console.log(subvtu_);
  const targetDate = new Date();
  const startDate = new Date(targetDate);
  startDate.setHours(0, 0, 0, 0);
  const todayTransactions = await Transaction.find({
    createdAt: { $gte: startDate, $lte: targetDate },
    status: "completed",
  });
  const daily = todayTransactions.length;
  const purchase = todayTransactions
    .filter((item) => item.type === "debit")
    .reduce((sum, current) => sum + current.amount, 0);
  const data = await dashboardData(req.user, true);
  const totalUser = await User.countDocuments();
  res.status(200).render("admin/dashboard", {
    ...data,
    total_user: totalUser,
    daily,
    purchase,
  });
};

const businessBal = async (req, res) => {
  const data = await dashboardData(req.user);
  res.status(200).render("admin/businessbal", data);
};

const adminTrans = async (req, res) => {
  const data = await dashboardData(req.user);
  res.status(200).render("admin/transactions", data);
};

const adminSettings = async (req, res) => {
  const data = await dashboardData(req.user);
  res.status(200).render("admin/adminsettings", data);
};

const allUsers = async (req, res) => {
  const data = await dashboardData(req.user);
  res.status(200).render("admin/allusers", data);
};

const adminDataReset = async (req, res) => {
  const data = await dashboardData(req.user);
  res.status(200).render("resets/data", data);
};

const adminCableReset = async (req, res) => {
  const data = await dashboardData(req.user);
  res.status(200).render("resets/tv", data);
};

const adminExamReset = async (req, res) => {
  const data = await dashboardData(req.user);
  res.status(200).render("resets/exam", data);
};

const adminElectricityReset = async (req, res) => {
  const data = await dashboardData(req.user);
  res.status(200).render("resets/electricity", data);
};

module.exports = {
  homePage,
  dashboard,
  airtime,
  dataplan,
  billpayment,
  wallet,
  fundWallet,
  receiveWallet,
  setting,
  verifyNow,
  profile,
  test,
  billPayer,
  privacyPolicy,
  adminDashboard,
  businessBal,
  adminSettings,
  allUsers,
  adminTrans,
  adminDataReset,
  adminCableReset,
  adminElectricityReset,
  adminExamReset,
};
