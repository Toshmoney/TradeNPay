const express = require("express");
const { isAuthenticated, isAdmin } = require("../middleware/authenticate");
const {
    getSingleTradePlan,
    updateTradePlan, 
    deleteTradePlan, 
    batchUpload, 
    createTradePlan, 
    getTradePlans
} = require("../controller/tradePlan");

const router = express.Router();

router
  .route("/")
  .get(getTradePlans);
router
  .route("/:service_id")
  .get(getSingleTradePlan)
  .post([isAuthenticated, isAdmin], updateTradePlan)
  .delete([isAuthenticated, isAdmin], deleteTradePlan);
router.route("/upload").post([isAuthenticated, isAdmin], batchUpload);
router.route("/create-trade").post([isAuthenticated, isAdmin], createTradePlan);
module.exports = router;
