const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const { PORT_NO } = require("./src/config/index");
require("dotenv").config();
const morgan = require("morgan");
app.use(express.json());
require("./src/database/db");

app.use(morgan("dev"));

//Routes
const AuthRoutes = require("./src/routes/auth");
const GiftcardRoutes = require("./src/routes/giftCard");
const AirtimeRoutes = require("./src/routes/airtime");
const MobileDataRoutes = require("./src/routes/mobiledata");

corsOption = {
  origin: "*",
};
app.use(cors(corsOption));

PORT = PORT_NO || 3001;

app.use("/api/auth", AuthRoutes);
app.use("/api/gift-cards", GiftcardRoutes);
app.use("/api/airtime", AirtimeRoutes);
app.use("/api/mobile-data", MobileDataRoutes);

app.get("/", function (req, res) {
  res.send("Welcome to sojiPay API");
});

app.listen(PORT, () => {
  console.log(`App connected and is running on on port ${PORT}`);
});
