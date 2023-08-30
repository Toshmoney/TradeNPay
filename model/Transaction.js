const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const TransactionSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance_before: {
      type: Number,
      required: [true, "balance before transaction not indicated"],
    },
    balance_after: {
      type: Number,
      required: [true, "balance after transaction not indicated"],
    },
    amount: {
      type: Number,
      required: [true, "transaction amount not indicated"],
    },
    service: {
      type: String,
      enum: ["airtime", "data", "exam", "electricity", "tv", "wallet"],
      required: [true, "service type not indicated"],
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: [true, "transaction type not indicated"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
      required: true,
    },
    description: {
      type: String,
      required: [true, "transaction not described"],
    },
    reference_number: {
      type: String,
      trim: true,
      required: [true, "transaction not referenced"],
    },
    external_id: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Transaction = model("Transaction", TransactionSchema);

module.exports = Transaction;
