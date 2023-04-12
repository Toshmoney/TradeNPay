const express = require("express");
const router = express.Router();
const {homePage,signIn,signUp,dashboard,signOut,
airtime,dataplan, billpayment, wallet, fundWallet,
receiveWallet, setting, profile, verifyNow, test } = require("../controller/controller")

router.route("/").get(homePage)
router.route("/test").get(test)
router.route("/sign-in").get(signIn)
router.route("/sign-up").get(signUp)
router.route("/sign-out").get(signOut)
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