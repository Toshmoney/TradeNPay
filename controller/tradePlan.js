require("dotenv").config();
const DataPlan = require("../model/DataPlan");
const TradePlan = require("../model/TradePlan")
const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../handleError");
const { formatPlan } = require("../utils");
// const { subvtu_recharge } = require("../utils/subvtu");
const Transaction = require("../model/Transaction");
// const PURCHASE_ENDPOINT = process.env.DATA_PURCHASE_ENDPOINT;

const createTradePlan = async (req, res) => {
  const newPlan = await TradePlan.create(req.body);
  res.status(StatusCodes.CREATED).json({
    message: "data plan created suceesfully",
    success: true,
    data: newPlan,
  });
};

const getTradePlans = async (req, res) => {
  const { trade_id } = req.query;
  const queryObject = {};
  if (trade_id) {
    queryObject.trade_id = trade_id;
  }
  const trade_plans = await TradePlan.find(queryObject);
  res.status(StatusCodes.OK).json({
    message: "trade plans list",
    success: true,
    data: trade_plans,
  });
};

const getSingleTradePlan = async (req, res) => {
  const { trade_id } = req.params;
  const trade_plan = await TradePlan.findOne({ plan_id: trade_id });
  if (!trade_plan) {
    throw new CustomAPIError(
      `data plan with plan id: ${trade_id} does not exist`,
      404
    );
  }
  return res.status(StatusCodes.OK).json({
    message: "trade plan fetched successfully",
    success: true,
    data: formatPlan(trade_plan),
  });
};

const updateTradePlan = async (req, res) => {
  const { trade_id } = req.params;
  const upadated_data_plan = await TradePlan.findOneAndUpdate(
    { _id: trade_id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!upadated_trade_plan) {
    throw new CustomAPIError(
      `trade plan with plan id: ${plan_id} does not exist`,
      404
    );
  }
  res.status(StatusCodes.OK).json({
    message: "trade plan updated successfully",
    success: true,
    data: upadated_trade_plan,
  });
};

const deleteTradePlan = async (req, res) => {
  const { trade_id } = req.params;
  const deleted_trade_plan = await TradePlan.findOneAndRemove({
    _id: trade_id,
  });
  if (!deleted_trade_plan) {
    throw new CustomAPIError(
      `trade plan with plan id: ${plan_id} does not exist`,
      404
    );
  }
  res.status(StatusCodes.OK).json({
    message: "trade plan deleted successfully",
    success: true,
    data: "",
  });
};

const batchUpload = async (req, res) => {
  const trade_plans = req.files?.trade_plans?.trade;
  if (!trade_plans) {
    throw new CustomAPIError("file is missing", StatusCodes.BAD_REQUEST);
  }
  const data = JSON.parse(trade_plans).plans;
  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    await TradePlan.create(item);
  }
  res.status(StatusCodes.CREATED).json({
    message: "file successfully uploaded",
    success: true,
    data: "",
  });
};

const purchaseTradePlan = async (req, res) => {
  const { plan_id, amount, mobile_number } = req.body;
  const user = req.user;
  const user_wallet = req.user.wallet;
  const initial_balance = user_wallet.current_balance;
  if (!mobile_number) {
    throw new CustomAPIError(
      "mobile number is missing",
      StatusCodes.BAD_REQUEST
    );
  }
  const data_plan = await DataPlan.findOne({ plan_id });
  if (!data_plan) {
    throw new CustomAPIError("unknown data plan", 400);
  }
  if (data_plan.sale_price !== amount) {
    throw new CustomAPIError("amount is not equal to plan price", 400);
  }
  const transaction = new Transaction({
    user: user._id,
    amount: data_plan.sale_price,
    balance_before: initial_balance,
    balance_after: initial_balance,
    type: "debit",
    status: "pending",
    service: "data",
    description: `payment for ${data_plan.size} ${data_plan.network_name} data`,
    reference_number: "",
  });

  // send purchase request to provider endpoint
  const purchase_id = await subvtu_recharge(PURCHASE_ENDPOINT, {
    network: data_plan.network_id,
    mobile_number: mobile_number,
    plan: plan_id,
    Ported_number: true,
  });

  const reqtrade = {
  "trade_id": "266",
  "trade_type": "FNF",
  "trade_name": "PAYPAL",
  "trade_category": 1,
  "dollar_sell_price": 900,
  "euro_sell_price": 900,
  "pounds_sell_price": 900,
  "dollar_buy_price": 900,
  "euro_buy_price": 900,
  "pounds_buy_price": 900,
  "is_available": true,
  "currency": "USD"
}

  if (!purchase_id) {
    throw new CustomAPIError(
      "unable to process transaction, try again later",
      422
    );
  }

  const new_balance = initial_balance - amount;
  user_wallet.previous_balance = initial_balance;
  user_wallet.current_balance = new_balance;
  transaction.reference_number = purchase_id;
  transaction.external_id = purchase_id;
  transaction.balance_after = new_balance;
  transaction.status = "completed";
  await transaction.save();
  await user_wallet.save();
  res.status(StatusCodes.ACCEPTED).json({
    message: "purchase request is being processed",
    success: true,
    balance: new_balance,
  });
};

module.exports = {
  purchaseTradePlan,
  createTradePlan,
  getTradePlans,
  getSingleTradePlan,
  updateTradePlan,
  deleteTradePlan,
  batchUpload,
};
