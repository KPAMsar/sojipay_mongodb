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

const AuthRoutes = require("./src/routes/auth");
corsOption = {
  origin: "*",
};
app.use(cors(corsOption));

PORT = PORT_NO;

app.use("/api/auth", AuthRoutes);

app.get("/", function (req, res) {
  res.send("Welcome to sojiPay API");
});

app.listen(PORT, () => {
  console.log(`App connected and is running on on port ${PORT}`);
});
