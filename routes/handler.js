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
  setting,
  profile,
  verifyNow,
  billPayer,
  privacyPolicy,
  businessBal,
  tradeService,
  trades,
  aboutPage,
  blog,
  contact,
  support,
  termsCondition,
  walletWithdraw,
  getQuiz,
  submitQuiz,
  createQuiz,
  adminPostQuiz,
  getNewQuiz,
  paypal,
  mobile,
  glo,
  method,
  mtnUssd,
  mtnBlog,
  sellPayoneer,
  sellPaypal,
  payPalFunds,
  sellFunds,
} = require("../controller/controller");

const {
  adminDashboard,
  adminTrans,
  allUsers,
  adminSettings,
  adminDataPlans,
  adminDataReset,
  adminCableReset,
  adminExamReset,
  adminElectricityReset,
  allTrades,
  approveTrades,
  createPost,
  getSinglePost,
  getAllPost,
  editSinglePost,
  deletePost,
  deleteAllPost,
  adminTradeReset,
  adminTradePlans,
  rejectTrades,
  adminManualFunding,

} = require("../controller/admin");

const { fetchPackages } = require("../controller/packageController");

const { isLoggedIn, isAdmin } = require("../middleware/authenticate");

const {
  newUser,
  signUpPage,
  logInPage,
  logout,
  forgotPassword,
  confirmReset,
  confirmPass,
  getPasswordUpdatedPage,
  updatePassword,
} = require("../controller/auth");

const fundWalletVerify = require("../controller/fundWallet");

const { newPin, updatePin } = require("../controller/transactionPin");
const { checkUserPin, verifyUserPin } = require("../middleware/checkUserPin");
const { withdrawalRequest, fetchsupportbanks } = require("../controller/withdrawFunds");
const addFundsManually = require("../controller/addFundManually");

// const { buyPaypal } = require("../controller/paypalController");

router.route("/api/v1/packages").post(fetchPackages);
router.route("/").get(homePage);

router.route("/about-us").get(aboutPage)
router.route("/blog").get(blog)
router.route("/support").get(support)
router.route("/contact").get(contact)
router.route("/privacy").get(privacyPolicy)
router.route("/terms-condition").get(termsCondition)
router.route("/how-to-create-a-paypal-account-in-nigeria-2023/").get(paypal)
router.route("/best-mobile-networks-in-nigeria/").get(mobile)
router.route("/easy-ways-to-get-free-data-on-glo-in-2024/").get(glo)
router.route("/best-methods-for-receiving-payment-in-nigeria/").get(method)
router.route("/mtn-ussd-code-for-apple-music-not-working-fixed/").get(mtnUssd)
router.route("/best-mtn-tariff-and-cheapest-data-plans-in-nigeria/").get(mtnBlog)
router.route("/buy-and-sell-payoneer-funds-in-nigeria/").get(sellPayoneer)
router.route("/buy-and-sell-paypal-funds-in-nigeria/").get(sellPaypal)
router.route("/sell-paypal-funds-in-nigeria-html/").get(payPalFunds)
router.route("/best-way-to-sell-paypal-funds-in-nigeria/").get(sellFunds)



router.route("/banks/get-bank-details").get(fetchsupportbanks)
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
router.route("/reset-password/:token").get(getPasswordUpdatedPage);
router.route("/reset-password/:token").post(updatePassword);
router.route("/sign-up").post(newUser);
router.route("/dashboard").get(isLoggedIn, dashboard);
router.route("/dashboard").post(dashboard);
router.route("/airtime").get([isLoggedIn, checkUserPin], airtime);
router.route("/data").get([isLoggedIn, checkUserPin], dataplan);
router.route("/billpayment").get([isLoggedIn, checkUserPin], billpayment);
router.route("/trades").get([isLoggedIn, checkUserPin], trades);

// Quiz
router.route("/quiz/take-quiz").get([isLoggedIn], getQuiz);
router.route("/quiz/submit-quiz").post([isLoggedIn], submitQuiz);
router.route("/quiz/next-question").get([isLoggedIn], getNewQuiz);
router
  .route("/billpayment/:service")
  .get([isLoggedIn, checkUserPin], billPayer);

  router
  .route("/trades/:service")
  .get([isLoggedIn, checkUserPin], tradeService);
router.route("/wallet").get(isLoggedIn, wallet);
router.route("/wallet/withdraw").post([isLoggedIn, checkUserPin], withdrawalRequest)
router.route("/wallet/fund").get(isLoggedIn, fundWallet);
// withdrawal page that authenticate user bank
router.route("/wallet/withdraw").get([isLoggedIn, checkUserPin], walletWithdraw);
router.route("/setting").get(isLoggedIn, setting);
router.route("/profile").get(isLoggedIn, profile);
router.route("/privacy-policy").get(isLoggedIn, privacyPolicy);
router.route("/verify_now").get(isLoggedIn, verifyNow);
router.route("/wallet/verify-payment").post(isLoggedIn, fundWalletVerify);
router.route("/wallet/fund-manual").post([isLoggedIn, isAdmin], addFundsManually);

// Trades only

// router.route("/trades/paypal").post(isLoggedIn, buyPaypal)

// Admin only
router.route("/admin").get([isLoggedIn, isAdmin], adminDashboard);
router.route("/quiz/admin-post").get([isLoggedIn, isAdmin], adminPostQuiz);
router.route("/quiz/post-question").post([isLoggedIn, isAdmin], createQuiz);
router.route("/blogs/all-posts").get([isLoggedIn, isAdmin], businessBal);
router.route("/create-post").post([isLoggedIn, isAdmin], createPost);
router.route("/edit-post/:slug").patch([isLoggedIn, isAdmin], editSinglePost);
router.route("/all-blog").get(getAllPost);
router.route("/all-blog").delete([isLoggedIn, isAdmin],deleteAllPost);
router.route("/post/:slug").get(getSinglePost);
router.route("/post/:slug").delete([isLoggedIn, isAdmin], deletePost);
router.route("/trade/all").get([isLoggedIn, isAdmin],allTrades);
router.route("/trades/approve/:id").post([isLoggedIn, isAdmin], approveTrades);
router.route("/manual/funding").get([isLoggedIn, isAdmin], adminManualFunding);
router.route("/manual/funding").post([isLoggedIn, isAdmin], addFundsManually);
router.route("/trades/reject/:id").post([isLoggedIn, isAdmin], rejectTrades);
router.route("/users/all-users").get([isLoggedIn, isAdmin], allUsers);
router.route("/admin/setting").get([isLoggedIn, isAdmin], adminSettings);
router.route("/transactions/all").get([isLoggedIn, isAdmin], adminTrans);
router
  .route("/data-plans/:plan_id/change")
  .get([isLoggedIn, isAdmin], adminDataReset);
router
  .route("/trades/:service_id/change")
  .get([isLoggedIn, isAdmin], adminTradeReset);
router.route("/admin/tv-reset").get([isLoggedIn, isAdmin], adminCableReset);
router.route("/admin/exam-reset").get([isLoggedIn, isAdmin], adminExamReset);
router
  .route("/admin/electricity-reset")
  .get([isLoggedIn, isAdmin], adminElectricityReset);
router.route("/admin/data-plans").get([isLoggedIn, isAdmin], adminDataPlans);
router.route("/admin/trade-plans").get([isLoggedIn, isAdmin], adminTradePlans);

// transaction pain
router.route("/new/pin").get([isLoggedIn], newPin).post([isLoggedIn], newPin);
router
  .route("/update/pin")
  .get([isLoggedIn], updatePin)
  .post([isLoggedIn], updatePin);

module.exports = router;
