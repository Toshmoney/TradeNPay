const { Schema, model } = require("mongoose");

const TradePlanSchema = new Schema(
  {
    trade_id: {
      type: String,
      required: [true, "Trade id field  is missing"],
    },
    account: {
      type: String,
      required: [true, "Admin account field  is missing"],
    },
    dollar_sell_price:{
      type:Number
    },
    euro_sell_price:{
      type:Number
    },
    pounds_sell_price:{
      type:Number
    },
    dollar_buy_price:{
      type:Number
    },
    euro_buy_price:{
      type:Number
    },
    pounds_buy_price:{ 
      type:Number
    },
    trade_name: {
      type: String,
      required: [true, "Trade name field  is missing"],
      uppercase: true,
    },
    trade_type: {
      type: String,
      required: [true, "Trade type field  is missing"],
    },
    trade_category: {
        type: String,
        required: [true, "Trade type field  is missing"],
      },
    is_available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const TradePlan = model("TradePlan", TradePlanSchema);
module.exports = TradePlan;
