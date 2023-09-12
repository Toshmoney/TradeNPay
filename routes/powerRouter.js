const express = require("express");

const router = express.Router();
const verifyWallet = require("../middleware/checkUserWallet");
const { validateCustomer } = require("../middleware/validateCustomer");
const { verifyUserPin } = require("../middleware/checkUserPin");
const { isAuthenticated } = require("../middleware/authenticate");

const { rechargeElectricity } = require("../controller/powerController");

router
  .route("/recharge")
  .post(
    [isAuthenticated, verifyUserPin, verifyWallet, validateCustomer],
    rechargeElectricity
  );

module.exports = router;
