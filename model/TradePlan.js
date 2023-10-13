const { Schema, model } = require("mongoose");

const TradePlanSchema = new Schema(
  {
    service_id: {
      type: String,
      required: [true, "Trade id field  is missing"],
    },
    currency: {
      type: String,
      required: [true, "Trade currency field  is missing"],
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
    trade_type: {
      type: String,
      required: [true, "Trade type field  is missing"],
    },
    is_available: {
      type: Boolean,
      default: true,
    },
    buing_mail:{
      type:String
    },
    selling_mail:{
      type:String
    },
  },
  { timestamps: true }
);

const TradePlan = model("TradePlan", TradePlanSchema);
module.exports = TradePlan;
