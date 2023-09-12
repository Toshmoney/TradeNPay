require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const HASH_NUMBER = Number(process.env.HASH_NUMBER);
const { Schema, model } = mongoose;

const pinSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pin: {
      type: String,
      required: [true, "transaction pin is required"],
    },
  },
  {
    timestamps: true,
  }
);

pinSchema.pre("save", async function (next) {
  const pin = this;
  if (!pin.isModified("pin")) return next();
  const salt = await bcrypt.genSalt(HASH_NUMBER);
  const hash = await bcrypt.hash(pin.pin, salt);
  pin.pin = hash;
  next();
});

pinSchema.methods.comparePin = async function (userPin) {
  return await bcrypt.compare(userPin, this.pin);
};

const TransactionPin = model("TransactionPin", pinSchema);

module.exports = TransactionPin;
