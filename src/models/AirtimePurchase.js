const mongoose = require("mongoose");

const airtimeSchema = new mongoose.Schema(
  {
    request_id: {
      type: String,
      required: [true, "Airtime Request ID is required"],
    },

    service_id: {
      type: String,
      required: [true, "Airtime Service ID is required"],
    },
    amount: {
      type: String,
      required: [true, "Airtime amount is required"],
    },
    phone_number: {
      type: Number,
      required: [true, "Phone number is required"],
    },
    status: {
      type: String,
      enum: ["pending", "successful", "Failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Airtime = mongoose.model("Airtime", airtimeSchema);

module.exports = Airtime;
