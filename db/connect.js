require("dotenv").config();
const mongoose = require("mongoose");

const NODE_ENV = process.env.NODE_ENV || "development";

let MONGO_URI = "";

if (NODE_ENV === "production") {
  MONGO_URI = process.env.MONGO_URI_PROD;
}
if (NODE_ENV === "testing") {
  MONGO_URI = process.env.MONGO_URI_TEST;
}
if (NODE_ENV === "development") {
  MONGO_URI = process.env.MONGO_URI_DEV;
}

// const pass = process.env.pass;

// const MONGO_URI =`mongodb+srv://Toshbaba:${pass}@tosh.e022gw2.mongodb.net/AlphabillsDB?retryWrites=true&w=majority`

const connectDB = async (msg) => {
 await mongoose.connect(MONGO_URI);
  return console.log(msg);
};
module.exports = connectDB;
