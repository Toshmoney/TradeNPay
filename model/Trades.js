const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const TradeSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "transaction amount not indicated"],
    },
    currency: {
      type: String,
      enum: ["USD", "CAD", "EUR", "GBP", "AUD"],
      required: [true, "trade currency not indicated"],
    },
    service_id: {
      type: String,
      enum: ["GNS", "FNF", "BCH", "USDT", "LTC", "ETH", "BTC", "AMAZON","EBAY", "STEAMAUD", "STEAMUSD", "STEAMGBP", "STEAMCAD", "STEAMEUR", "PAYONEER"],
      required: [true, "service type not indicated"],
    },
    trade_type:{
        type: String,
        required:[true, "Trades type not included"]
    },
    trans_id:{
      type:String,
      required:[true, "Transaction id not included"]
    },
    proof:{
      type:String
    }
    
  },
  { timestamps: true }
);

const Trades = model("Trades", TradeSchema);

module.exports = Trades;
