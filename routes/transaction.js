const express = require("express");
const { isAuthenticated, isAdmin } = require("../middleware/authenticate");
const {
  listTransaction,
  retrieveTransaction,
  deleteTransaction,
} = require("../controller/transaction");

const router = express.Router();

router.route("/").get([isAuthenticated], listTransaction);
router
  .route("/:trans_id")
  .delete([isAuthenticated, isAdmin], deleteTransaction)
  .get([isAuthenticated], retrieveTransaction);

module.exports = router;
