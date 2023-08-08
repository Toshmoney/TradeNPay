const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const WalletSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    current_balance: {
      type: Number,
      default: 0,
      required: true,
    },
    previous_balance: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

const Wallet = model("Wallet", WalletSchema);

module.exports = Wallet;
