const express = require("express");
const passport = require("passport")
const router = express.Router();
const { 
    homePage,dashboard,
    airtime,dataplan, billpayment, wallet, fundWallet,
    receiveWallet, setting, profile, verifyNow, test 
} = require("../controller/controller")

// middlewares

const {
    isLoggedIn
} = require("../middleware/authenticate")

const {
    newUser,
    signUpPage,
    logInPage,
    login,
    logout,
    forgotPassword,
    confirmReset,
    confirmPass
} = require('../controller/auth')

router.route("/").get(homePage)
router.route("/test").get(test)
router.route("/login").get(logInPage)
router.route("/login").post(passport.authenticate('local', { failureRedirect: '/login', failureFlash:'incorrect credientials', failureMessage: true }), login)
router.route('/logout').get(logout)
router.route("/sign-up").get(signUpPage)
router.route("/forgot-password").get(forgotPassword)
router.route("/forgot-password").post(forgotPassword)
router.route("/confirmation").get(confirmPass)
router.route("/confirmation").post(confirmReset)
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

module.exports = router;