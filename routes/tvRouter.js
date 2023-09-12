const express = require("express");
const verifyWallet = require("../middleware/checkUserWallet");
const { validateCustomer } = require("../middleware/validateCustomer");
const { verifyUserPin } = require("../middleware/checkUserPin");
const { isAuthenticated } = require("../middleware/authenticate");

const { rechargeTv } = require("../controller/tvController");

const router = express.Router();

router
  .route("/recharge")
  .post(
    [isAuthenticated, verifyUserPin, verifyWallet, validateCustomer],
    rechargeTv
  );

module.exports = router;
