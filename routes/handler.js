const express = require("express");
const passport = require("passport")
const router = express.Router();
const { 
    homePage,dashboard,
    airtime,dataplan, billpayment, wallet, fundWallet,
    receiveWallet, setting, profile, verifyNow, test, billPayer 
} = require("../controller/controller")

const {
    fetchPackages
} = require("../controller/packageController")

// middlewares

const {
    isLoggedIn
} = require("../middleware/authenticate")

const {
    newUser,
    signUpPage,
    logInPage,
    login,
    logout
} = require('../controller/auth')

router.route("/api/v1/packages").post(fetchPackages)
router.route("/").get(homePage)
router.route("/test").get(test)
router.route("/login").get(logInPage)
router.route("/login").post(passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash:'incorrect credientials',
    failureMessage: true
}), login)
router.route('/logout').get(logout)
router.route("/sign-up").get(signUpPage)
router.route("/sign-up").post(newUser)
router.route("/dashboard").get(isLoggedIn, dashboard)
router.route("/dashboard").post(dashboard)
router.route("/airtime").get(isLoggedIn, airtime)
router.route("/data").get(isLoggedIn, dataplan)
router.route("/billpayment").get(isLoggedIn, billpayment)
router.route("/wallet").get(isLoggedIn, wallet)
router.route("/wallet/fund").get(fundWallet);
router.route("/wallet/receive").get(receiveWallet);
router.route("/setting").get(isLoggedIn, setting);
router.route("/profile").get(isLoggedIn, profile);
router.route("/verify_now").get(verifyNow);
router.route("/billpayment/:service").get(isLoggedIn, billPayer);

module.exports = router;