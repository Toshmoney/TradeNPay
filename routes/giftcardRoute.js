const express = require("express");
const multer = require("multer");
// const upload = multer({dest : 'uploads/'});
const verifyWallet = require("../middleware/checkUserWallet");
const { verifyUserPin } = require("../middleware/checkUserPin");
const { isAuthenticated } = require("../middleware/authenticate");
const sellGiftcard = require("../controller/giftcardController");
const router = express.Router();

router
  .route("/sell-giftcard")
  .post([isAuthenticated, verifyUserPin, verifyWallet],
sellGiftcard);
module.exports = router;
