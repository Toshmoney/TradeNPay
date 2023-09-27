const DataPlan = require("../model/DataPlan");
const User = require("../model/User.db");
const { dashboardData } = require("../utils/dashboardData");
const { formatDate, data_provider } = require("../utils");
const { subvtu_balance } = require("../utils/subvtu");
const Transaction = require("../model/Transaction");
const Wallet = require("../model/Wallet");
const Trades = require("../model/Trades");

const adminDashboard = async (req, res) => {
  const subvtu_bal = await subvtu_balance();
  const business_bal = subvtu_bal?.user?.Account_Balance;
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
    business_balance: business_bal,
  });
};

const adminTrans = async (req, res) => {
  // const data = await dashboardData(req.user);
  let transactions = await Transaction.find()
    .sort("-createdAt")
    .populate("user", "name email _id");
  transactions = transactions.map((item) => {
    const transaction = item.toObject();
    return {
      ...transaction,
      createdAt: formatDate(transaction.createdAt),
      updatedAt: formatDate(transaction.updatedAt),
    };
  });
  res.status(200).render("admin/transactions", { transactions });
};

const allUsers = async (req, res) => {
  // const page = Number(req.query.page) || 1
  let wallets = await Wallet.find().populate("user");
  wallets = wallets.map((item) => {
    const wallet = item.toObject();
    return {
      user_id: wallet.user._id,
      name: wallet.user.name,
      email: wallet.user.email,
      createdAt: formatDate(wallet.user.createdAt),
      previous_balance: wallet.previous_balance,
      current_balance: wallet.current_balance,
    };
  });
  res.status(200).render("admin/allusers", { users: wallets });
};

const adminSettings = async (req, res) => {
  const data = await dashboardData(req.user);
  res.status(200).render("admin/adminsettings", data);
};

const adminDataPlans = async (req, res) => {
  const data_plans = await DataPlan.find().sort("-network_name");
  res.status(200).render("admin/dataplans", { data_plans });
};

const adminDataReset = async (req, res) => {
  const { plan_id } = req.params;
  const data_plan = await DataPlan.findOne({ plan_id: plan_id });
  res.status(200).render("resets/data", {
    data_plan: data_plan || {},
    networks: data_provider,
  });
};

const adminTradeReset = async (req, res) => {
  const { service_id } = req.params;
  const data_plan = await DataPlan.findOne({ plan_id: plan_id });
  res.status(200).render("resets/data", {
    data_plan: data_plan || {},
    networks: data_provider,
  });
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

const approveTrades = async(req, res)=>{
  const trades = await Trades.find()
}

module.exports = {
  adminDashboard,
  adminTrans,
  allUsers,
  adminSettings,
  adminDataPlans,
  adminDataReset,
  adminCableReset,
  adminExamReset,
  adminElectricityReset,
};
