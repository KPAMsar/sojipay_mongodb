const mongoose = require("mongoose");

const giftCardTransactionSchema = new mongoose.Schema(
  {
    gift_card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GiftCard ",
      required: true,
    },
    bank_account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountDetails",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const GiftCardTransaction = mongoose.model(
  "GiftCardTransaction",
  giftCardTransactionSchema
);

module.exports = GiftCardTransaction;
