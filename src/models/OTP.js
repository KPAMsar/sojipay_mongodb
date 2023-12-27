const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
