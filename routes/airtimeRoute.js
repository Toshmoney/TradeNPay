const express = require("express");
const verifyWallet = require("../middleware/checkUserWallet");
const { verifyUserPin } = require("../middleware/checkUserPin");
const { buyAirtime } = require("../controller/airtimeController");
const { isAuthenticated } = require("../middleware/authenticate");
const router = express.Router();

router
  .route("/recharge")
  .post([isAuthenticated, verifyUserPin, verifyWallet], buyAirtime);

module.exports = router;
