const express = require('express')

const verifyWallet = require("../middleware/checkUserWallet")

const {
    fetchDataPrices,
    buyData
} = require('../controller/dataController')

const router = express.Router()

router.route('/prices').post(fetchDataPrices)
router.route('/recharge').post(verifyWallet, buyData)

module.exports = router