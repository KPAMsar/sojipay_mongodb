const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/auth");
const TVController = require("../controllers/tvController");

router.get("/tv-packages", Auth, TVController.getDstvPackages);
router.post("/verify", Auth, TVController.verifySmartCardNumber);
router.post("/change-bouquet", Auth, TVController.changeBouquet);

module.exports = router;
