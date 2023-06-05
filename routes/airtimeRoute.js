const express = require("express")
const verifyWallet = require("../middleware/checkUserWallet")
const {
    buyAirtime
} = require("../controller/airtimeController")
const router = express.Router()

router.route('/recharge').post(verifyWallet, buyAirtime)

module.exports = router