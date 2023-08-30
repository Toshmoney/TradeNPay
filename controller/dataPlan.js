const DataPlan = require("../model/DataPlan");
const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../handleError");
const { formatPlan } = require("../utils");

const createDataPlan = async (req, res) => {
  const newPlan = await DataPlan.create(req.body);
  res.status(StatusCodes.CREATED).json({
    message: "data plan created suceesfully",
    success: true,
    data: newPlan,
  });
};

const getDataPlans = async (req, res) => {
  const { network_id } = req.query;
  const queryObject = {};
  if (network_id) {
    queryObject.network_id = network_id;
  }
  const data_plans = await DataPlan.find(queryObject);
  res.status(StatusCodes.OK).json({
    message: "data plans list",
    success: true,
    data: data_plans,
  });
};

const getSingleDataPlan = async (req, res) => {
  const { plan_id } = req.params;
  const data_plan = await DataPlan.findOne({ plan_id: plan_id });
  if (!data_plan) {
    throw new CustomAPIError(
      `data plan with plan id: ${plan_id} does not exist`,
      404
    );
  }
  return res.status(StatusCodes.OK).json({
    message: "data plan fetched successfully",
    success: true,
    data: formatPlan(data_plan),
  });
};

const updateDataPlan = async (req, res) => {
  const { plan_id } = req.params;
  const upadated_data_plan = await DataPlan.findOneAndUpdate(
    { plan_id: plan_id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!upadated_data_plan) {
    throw new CustomAPIError(
      `data plan with plan id: ${plan_id} does not exist`,
      404
    );
  }
  res.status(StatusCodes.OK).json({
    message: "data plan updated successfully",
    success: true,
    data: upadated_data_plan,
  });
};

const deleteDataPlan = async (req, res) => {
  const { plan_id } = req.params;
  const deleted_data_plan = await DataPlan.findOneAndRemove({
    plan_id: plan_id,
  });
  if (!deleted_data_plan) {
    throw new CustomAPIError(
      `data plan with plan id: ${plan_id} does not exist`,
      404
    );
  }
  res.status(StatusCodes.OK).json({
    message: "data plan deleted successfully",
    success: true,
    data: "",
  });
};

const batchUpload = async (req, res) => {
  const data_plans = req.files?.data_plans?.data;
  if (!data_plans) {
    throw new CustomAPIError("file is missing", StatusCodes.BAD_REQUEST);
  }
  const data = JSON.parse(data_plans).plans;
  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    await DataPlan.create(item);
  }
  res.status(StatusCodes.CREATED).json({
    message: "file successfully uploaded",
    success: true,
    data: "",
  });
};

const purchaseDataPlan = async (req, res) => {
  const {} = req.body;
  res.status(StatusCodes.ACCEPTED).json({
    message: "purchase request is being processed",
    success: true,
  });
};

module.exports = {
  purchaseDataPlan,
  createDataPlan,
  getDataPlans,
  getSingleDataPlan,
  updateDataPlan,
  deleteDataPlan,
  batchUpload,
};
