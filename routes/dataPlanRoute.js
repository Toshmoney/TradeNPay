const express = require('express')

const {
    fetchDataPrices
} = require('../controller/dataController')

const router = express.Router()

router.route('/prices').post(fetchDataPrices)

module.exports = router