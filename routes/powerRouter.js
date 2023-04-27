const express = require("express")

const router = express.Router()
const verifyWallet = require("../middleware/checkUserWallet")
const { validateCustomer } = require("../middleware/validateCustomer")

const { rechargeElectricity } = require('../controller/powerController')

router.route('/recharge').post([verifyWallet, validateCustomer], rechargeElectricity)

module.exports = router
