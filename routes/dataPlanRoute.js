const express = require("express");
const { isAuthenticated, isAdmin } = require("../middleware/authenticate");
const verifyWallet = require("../middleware/checkUserWallet");
const { fetchDataPrices, buyData } = require("../controller/dataController");
const {
  createDataPlan,
  getDataPlans,
  getSingleDataPlan,
  updateDataPlan,
  deleteDataPlan,
  batchUpload,
  purchaseDataPlan,
} = require("../controller/dataPlan");
const { verifyUserPin } = require("../middleware/checkUserPin");

const router = express.Router();

router.route("/prices").post(fetchDataPrices);
router
  .route("/recharge")
  .post([isAuthenticated, verifyUserPin, verifyWallet], buyData);
router
  .route("/purchase")
  .post([isAuthenticated, verifyUserPin, verifyWallet], purchaseDataPlan);
router
  .route("/")
  .post([isAuthenticated, isAdmin], createDataPlan)
  .get(getDataPlans);
router
  .route("/:plan_id")
  .get(getSingleDataPlan)
  .patch([isAuthenticated, isAdmin], updateDataPlan)
  .delete([isAuthenticated, isAdmin], deleteDataPlan);
router.route("/upload").post([isAuthenticated, isAdmin], batchUpload);
module.exports = router;
