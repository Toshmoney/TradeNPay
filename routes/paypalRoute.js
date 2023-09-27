const express = require("express");
const verifyWallet = require("../middleware/checkUserWallet");
const { verifyUserPin } = require("../middleware/checkUserPin");
const { isAuthenticated } = require("../middleware/authenticate");
const { buyPaypal, sellPaypal } = require("../controller/paypalController");
const router = express.Router();

router
  .route("/buy-paypal")
  .post([isAuthenticated, verifyUserPin, verifyWallet], buyPaypal);

  router
  .route("/sell-paypal")
  .post([isAuthenticated, verifyUserPin, verifyWallet], sellPaypal);

module.exports = router;
