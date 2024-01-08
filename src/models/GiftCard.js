const mongoose = require("mongoose");

const giftCardSchema = new mongoose.Schema({
  cardname: {
    type: String,
    required: [true, "Card name is required"],
  },
  cardnumber: {
    type: Number,
    required: [true, "Card number is required"],
  },

  pin: {
    type: Number,
    required: [true, "Pin number is required"],
  },
  amount: {
    type: String,
    required: [true, "Card Value is required"],
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});

const GiftCard = mongoose.model("GiftCard", giftCardSchema);

module.exports = GiftCard;
