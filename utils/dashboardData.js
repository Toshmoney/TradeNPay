const Wallet = require("../model/Wallet");
const Transaction = require("../model/Transaction");

const formatTransactionDate = (date_string) => {
  const trans_date = new Date(date_string);
  const year = trans_date.getFullYear();
  let month = trans_date.getMonth() + 1;
  let day = trans_date.getDate();
  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }
  return `${year}-${month}-${day}`;
};

const formatTransaction = (transaction) => {
  return {
    description: transaction.description,
    amount: transaction.amount,
    status: transaction.status,
    date: formatTransactionDate(transaction.createdAt),
    createdAt: formatTransactionDate(transaction.createdAt),
  };
};

const fetchUserTransactions = async (userId, limit = 20) => {
  let transactions = await Transaction.find({ user: userId })
    .sort("-createdAt")
    .limit(limit);
  if (transactions.length === 0) {
    return [];
  }
  transactions = transactions.map((transaction) => {
    const item = transaction.toObject();
    return {
      ...item,
      createdAt: formatTransactionDate(item.createdAt),
      updatedAt: formatTransactionDate(item.updatedAt),
    };
  });
  return transactions;
};

const dashboardData = async (user) => {
  const userWallet = await Wallet.findOne({
    user: user._id,
  });
  const userTransactions = await fetchUserTransactions(user._id);
  const user_data = {
    name: user.name,
    email: user.email,
  };
  const data = {
    user: user_data,
    transactions: userTransactions,
  };
  if (userWallet) {
    user_data.balance = userWallet.balance;
    data.balance = userWallet.balance;
  }
  return data;
};

module.exports = {
  dashboardData,
  formatTransaction,
};
