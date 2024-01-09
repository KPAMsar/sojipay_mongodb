const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    request_id: {
      type: String,
      required: [true, "Data Request ID is required"],
    },

    service_id: {
      type: String,
      required: [true, "Data Service ID is required"],
    },
    billersCode: {
      type: String,
      required: [true, "Data billers code is required"],
    },
    variation_code: {
      type: String,
      required: [true, "Variation code is required"],
    },
    amount: {
      type: String,
      required: [true, "Data amount is required"],
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const DataPurchase = mongoose.model("DataPurchase", dataSchema);

module.exports = DataPurchase;
