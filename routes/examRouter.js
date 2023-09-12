const express = require("express");

const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticate");
const verifyWallet = require("../middleware/checkUserWallet");
const { verifyUserPin } = require("../middleware/checkUserPin");

const { buyExamPin } = require("../controller/examController");

router
  .route("/buy-result-checker")
  .post([isAuthenticated, verifyUserPin, verifyWallet], buyExamPin);

module.exports = router;
