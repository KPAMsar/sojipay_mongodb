const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/auth");
const AirtimeController = require("../controllers/airtimeController");

router.post("/buy-airtime", Auth, AirtimeController.purchaseAirtime);

module.exports = router;
