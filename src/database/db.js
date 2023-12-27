const mongoose = require("mongoose");
require("dotenv").config();

const { DB_URL } = process.env;
console.log("sv", DB_URL);

const options = {
  useNewUrlParser: true,

  useUnifiedTopology: true,
};

mongoose
  .connect(DB_URL, options)
  .then(() => {
    console.log("database successfully connected");
  })
  .catch((err) => {
    console.log("database connection failed");
    console.log(err);
  });
