const mongoose = require("mongoose");

const accountDetailsSchema = new mongoose.Schema(
  {
    bank_name: {
      type: String,
      required: [true, "Bank name is required"],
    },
    account_number: {
      type: Number,
      required: [true, "Account number is required"],
    },

    account_name: {
      type: Number,
      required: [true, "Account name  is required"],
    },
  },
  { timestamps: true }
);

const AccountDetails = mongoose.model("AccountDetails", accountDetailsSchema);

module.exports = AccountDetails;
