const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/auth");
const GiftController = require("../controllers/giftCardController");
const upload = require("../utils/multer");

router.post("/create", upload.single("image"), GiftController.sellGiftCard);
module.exports = router;
