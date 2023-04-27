const express = require("express")
const {
    rechargeTv
} = require("../controller/tvController")

const router = express.Router()

router.route('/recharge').post(rechargeTv)

module.exports = router