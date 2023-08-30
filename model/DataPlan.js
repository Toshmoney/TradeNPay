const { Schema, model } = require("mongoose");

const DataPlanSchema = new Schema(
  {
    network_id: {
      type: String,
      required: [true, "network id field  is missing"],
    },
    network_name: {
      type: String,
      required: [true, "network name field  is missing"],
      uppercase: true,
    },
    plan_id: {
      type: String,
      required: [true, "plan id  field is missing"],
      unique: [true, "duplicate value for plan_id."],
    },
    plan_type: {
      type: String,
      required: [true, "plan type field  is missing"],
    },
    cost: {
      type: Number,
      required: [true, "cost field is missing"],
    },
    sale_price: {
      type: Number,
      required: [true, "sale price field is missing"],
    },
    size: {
      type: String,
      required: [true, "size field is missing"],
    },
    validity: {
      type: String,
      required: [true, "validity field is missing"],
    },
    is_available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const DataPlan = model("DataPlan", DataPlanSchema);
module.exports = DataPlan;
