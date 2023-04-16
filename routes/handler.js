const express = require("express");
const passport = require("passport")
const router = express.Router();
const { 
    homePage,dashboard,
    airtime,dataplan, billpayment, wallet, fundWallet,
    receiveWallet, setting, profile, verifyNow, test 
} = require("../controller/controller")

const {
    newUser,
    signUpPage,
    logInPage,
    login,
    logout
} = require('../controller/auth')

router.route("/").get(homePage)
router.route("/test").get(test)
router.route("/login").get(logInPage)
router.route("/login").post(passport.authenticate('local', { failureRedirect: '/login' }), login)
router.route('/logout').get(logout)
router.route("/sign-up").get(signUpPage)
router.route("/sign-up").post(newUser)
router.route("/dashboard").get(dashboard)
router.route("/dashboard").post(dashboard)
router.route("/airtime").get(airtime)
router.route("/data").get(dataplan)
router.route("/billpayment").get(billpayment)
router.route("/wallet").get(wallet)
router.route("/wallet/fund").get(fundWallet);
router.route("/wallet/receive").get(receiveWallet);
router.route("/setting").get(setting);
router.route("/profile").get(profile);
router.route("/verify_now").get(verifyNow);

module.exports = router;