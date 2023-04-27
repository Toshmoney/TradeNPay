const express = require("express")
const {
    buyAirtime
} = require("../controller/airtimeController")
const router = express.Router()

router.route('/recharge').post(buyAirtime)

module.exports = router