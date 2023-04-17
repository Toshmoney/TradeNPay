const express = require('express')

const {
    fetchDataPrices,
    buyData
} = require('../controller/dataController')

const router = express.Router()

router.route('/prices').post(fetchDataPrices)
router.route('/recharge').post(buyData)

module.exports = router