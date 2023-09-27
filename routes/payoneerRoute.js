const express = require("express");
const verifyWallet = require("../middleware/checkUserWallet");
const { verifyUserPin } = require("../middleware/checkUserPin");
const { isAuthenticated } = require("../middleware/authenticate");
const { buyPayoneer, sellPayoneer } = require("../controller/payoneerController");
const router = express.Router();

router
  .route("/buy-payoneer")
  .post([isAuthenticated, verifyUserPin, verifyWallet], buyPayoneer);

  router
  .route("/sell-payoneer")
  .post([isAuthenticated, verifyUserPin, verifyWallet], sellPayoneer);

module.exports = router;
