const express = require("express")
const verifyWallet = require("../middleware/checkUserWallet")
const { validateCustomer } = require("../middleware/validateCustomer")

const {
    rechargeTv
} = require("../controller/tvController")

const router = express.Router()

router.route('/recharge').post([verifyWallet, validateCustomer], rechargeTv)

module.exports = router