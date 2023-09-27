const express = require("express");
const multer = require("multer");
// const upload = multer({dest : 'uploads/'});
const verifyWallet = require("../middleware/checkUserWallet");
const { verifyUserPin } = require("../middleware/checkUserPin");
const { isAuthenticated } = require("../middleware/authenticate");
// const sellGiftcard = require("../controller/giftcardController");
const sellCrypto = require("../controller/cryptoController");
const router = express.Router();

router
  .route("/sell-crypto")
  .post([isAuthenticated, verifyUserPin, verifyWallet], sellCrypto
);
module.exports = router;
