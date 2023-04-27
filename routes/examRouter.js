const express = require("express")

const router = express.Router()

const verifyWallet = require("../middleware/checkUserWallet")

const { buyExamPin } = require("../controller/examController")

router.route('/buy-result-checker').post(verifyWallet, buyExamPin)

module.exports = router
