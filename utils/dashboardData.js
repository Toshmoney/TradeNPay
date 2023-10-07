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
    id: transaction._id,
    description: transaction.description,
    balance_before: transaction.balance_before,
    balance_after: transaction.balance_after,
    amount: transaction.amount,
    status: transaction.status,
    date: formatTransactionDate(transaction.createdAt),
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

const dashboardData = async (user, is_admin = false, limit = 20) => {
  let userid = user?._id
  const userWallet = await Wallet.findOne({
    user: userid,
  });
  let trxns = [];
  if (is_admin) {
    trxns = await Transaction.find()
      .sort("-createdAt")
      .limit(limit)
      .populate("user", "name email, _id");
    trxns = trxns.map((transaction) => {
      const item = transaction.toObject();
      return {
        ...item,
        createdAt: formatTransactionDate(item.createdAt),
        updatedAt: formatTransactionDate(item.updatedAt),
      };
    });
  } else {
    trxns = await fetchUserTransactions(user._id, limit);
  }
  const user_data = {
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber
  };
  const data = {
    user: user_data,
    transactions: trxns,
  };
  if (userWallet) {
    user_data.balance = userWallet.current_balance;
    data.balance = userWallet.current_balance;
  }
  return data;
};

module.exports = {
  dashboardData,
  formatTransaction,
};
