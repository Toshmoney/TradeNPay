const { CustomAPIError } = require("../handleError");
const Transaction = require("../model/Transaction");
const { formatTransaction } = require("../utils/dashboardData");
const { StatusCodes } = require("http-status-codes");

const retrieveTransaction = async (req, res) => {
  const user = req.user;
  const { trans_id } = req.params;
  const item = await Transaction.findOne({ _id: trans_id }).populate(
    "user",
    "_id email name"
  );
  if (!item) {
    throw new CustomAPIError("record not found", 404);
  }
  if (item.user._id !== user._id && !user.is_admin) {
    throw new CustomAPIError("not authorized", StatusCodes.FORBIDDEN);
  }
  return res.status(StatusCodes.OK).json({
    message: "item retrieved successfully",
    success: true,
    data: {
      ...formatTransaction(item),
      user: item.user,
    },
  });
};

const listTransaction = async (req, res) => {
  const user = req.user;
  const { service } = req.query;
  const query_params = {};
  if (!user.is_admin) {
    query_params.user = user;
  }
  if (service) {
    query_params.service = service;
  }
  let records = Transaction.find({ ...query_params });
  records = (await records).map((record) => formatTransaction(record));
  return res.status(StatusCodes.OK).json({
    message: "Transactions retrieved successfully",
    success: true,
    data: records,
  });
};

const deleteTransaction = async (req, res) => {
  const item = await Transaction.findOneAndDelete({ _id: req.params.trans_id });
  if (!item) {
    throw new CustomAPIError("item does not exist", StatusCodes.NOT_FOUND);
  }
  res.status(StatusCodes.ACCEPTED).json({
    message: "transaction record delete successfully",
    success: true,
  });
};

const listPayment = async () => {};

const retrievePayment = async () => {};

module.exports = {
  listTransaction,
  retrieveTransaction,
  deleteTransaction,
  listPayment,
  retrievePayment,
};
