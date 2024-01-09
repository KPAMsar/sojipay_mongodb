const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/auth");
const MobileDataController = require("../controllers/dataController");

router.get("/", Auth, MobileDataController.getDataList);
router.post("/buy-data", Auth, MobileDataController.purchaseData);

module.exports = router;
