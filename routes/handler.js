const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
  homePage,
  dashboard,
  airtime,
  dataplan,
  billpayment,
  wallet,
  fundWallet,
  receiveWallet,
  setting,
  profile,
  verifyNow,
  test,
  billPayer,
  privacyPolicy,
  adminDashboard,
  businessBal,
  adminSettings,
  allUsers,
  adminTrans,
  adminDataReset,
  adminCableReset,
  adminExamReset,
  adminElectricityReset
} = require("../controller/controller");

const { fetchPackages } = require("../controller/packageController");

// middlewares

const { isLoggedIn } = require("../middleware/authenticate");

const {
  newUser,
  signUpPage,
  logInPage,
  logout,
  forgotPassword,
  confirmReset,
  confirmPass,
} = require("../controller/auth");

const fundWalletVerify = require("../controller/fundWallet");
const { businessBalance } = require("../utils");

router.route("/api/v1/packages").post(fetchPackages);
router.route("/").get(homePage);
router.route("/test").get(test);
router.route("/login").get(logInPage);
router.route("/login").post((req, res, next) => {
  const redirectUrl = req.session.requestedUrl || "/dashboard";
  passport.authenticate("local", {
    successRedirect: redirectUrl,
    failureRedirect: "/login",
    failureFlash: "incorrect credientials",
    failureMessage: true,
  })(req, res, next);
});
router.route("/logout").get(logout);
router.route("/sign-up").get(signUpPage);
router.route("/forgot-password").get(forgotPassword);
router.route("/forgot-password").post(forgotPassword);
router.route("/confirmation").get(confirmPass);
router.route("/confirmation").post(confirmReset);
router.route("/sign-up").post(newUser);
router.route("/dashboard").get(isLoggedIn, dashboard);
router.route("/dashboard").post(dashboard);
router.route("/airtime").get(isLoggedIn, airtime);
router.route("/data").get(isLoggedIn, dataplan);
router.route("/billpayment").get(isLoggedIn, billpayment);
router.route("/wallet").get(isLoggedIn, wallet);
router.route("/wallet/fund").get(isLoggedIn, fundWallet);

router.route("/admin").get(isLoggedIn, adminDashboard);
router.route("/business-balance").get(isLoggedIn, businessBal);
router.route("/all-users").get(isLoggedIn, allUsers);
router.route("/admin-setting").get(isLoggedIn, adminSettings);
router.route("/transactions").get(isLoggedIn, adminTrans);
router.route("/data-reset").get(isLoggedIn, adminDataReset);
router.route("/tv-reset").get(isLoggedIn, adminCableReset);
router.route("/exam-reset").get(isLoggedIn, adminExamReset);
router.route("/electricity-reset").get(isLoggedIn, adminElectricityReset);

router.route("/wallet/receive").get(isLoggedIn, receiveWallet);
router.route("/setting").get(isLoggedIn, setting);
router.route("/profile").get(isLoggedIn, profile);
router.route("/privacy-policy").get(isLoggedIn, privacyPolicy);
router.route("/verify_now").get(isLoggedIn, verifyNow);
router.route("/billpayment/:service").get(isLoggedIn, billPayer);
router.route("/wallet/verify-payment").post(isLoggedIn, fundWalletVerify);

module.exports = router;
