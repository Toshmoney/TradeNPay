require("dotenv").config();
const mongoose = require("mongoose");

const NODE_ENV = process.env.NODE_ENV || 'development'

let MONGO_URI=''

if (NODE_ENV === 'production') {
    MONGO_URI = process.env.MONGO_URI_PROD
}
if (NODE_ENV === 'testing') {
    MONGO_URI = process.env.MONGO_URI_TEST
}
if (NODE_ENV === 'development') {
    MONGO_URI = process.env.MONGO_URI_DEV
}


const connectDB = async ()=>{
    return await mongoose.connect(MONGO_URI)
}
module.exports = connectDB