const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        required:[true, "Must provide name"],
        maxlength:[20, "Name can not be more than 20 characters!"],
        type: String,
        trim: true,
    },
    username:{
        required:[true, "Username is required!!"],
        maxlength:[10, "Username can not be more than 10 characters."],
        type: String,
    },
    password:{
        type: String,
        required:[true, "Password is required."],
        trim: true,
    },
    updated:{
        type: Date,
        default: Date.now()
    },
    age:{
        type: Number,
        min: 18, max: 65
    },
    avail_bal:{
        type: Number,
    },
    kyc_ver:{
        type:Boolean,
        default: false
    },
    two_step_ver:{
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model("User", userSchema)