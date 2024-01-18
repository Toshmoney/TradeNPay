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
    message: "new trade created suceesfully",
    success: true,
    data: newPlan,
  });
};

const getTradePlans = async (req, res) => {
  const { service_id } = req.query;
  const queryObject = {};
  if (service_id) {
    queryObject.service_id = service_id;
  }
  const trade_plans = await TradePlan.find(queryObject);
  res.status(StatusCodes.OK).json({
    message: "trade plans list",
    success: true,
    data: trade_plans,
  });
};

const getSingleTradePlan = async (req, res) => {
  const { service_id } = req.params;
  const trade_plan = await TradePlan.findOne({ service_id: service_id });
  if (!trade_plan) {
    throw new CustomAPIError(
      `Trade with plan id: ${service_id} does not exist`,
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
  const { service_id } = req.params;
  const upadated_trade_plan = await TradePlan.findOneAndUpdate(
    { service_id: service_id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!upadated_trade_plan) {
    throw new CustomAPIError(
      `trade with plan id: ${plan_id} does not exist`,
      404
    );
  }
  // res.status(StatusCodes.OK).json({
  //   message: "trade plan updated successfully",
  //   success: true,
  //   data: upadated_trade_plan,
  // });

  req.flash("info", "Successfully updated trade!")
  return res.redirect("/admin/trade-plans")
};

const deleteTradePlan = async (req, res) => {
  const { service_id } = req.params;
  const deleted_trade_plan = await TradePlan.findOneAndRemove({
    service_id: service_id,
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

module.exports = {
  createTradePlan,
  getTradePlans,
  getSingleTradePlan,
  updateTradePlan,
  deleteTradePlan,
  batchUpload,
};
