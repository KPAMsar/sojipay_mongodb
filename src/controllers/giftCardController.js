const GiftCard = require("../models/GiftCard");
const AccountDetails = require("../models/AccountDetails");
const GiftCardTransaction = require("../models/GiftCardTransaction");
const Cloudinary = require("../utils/cloudinary");

const sellGiftCard = async (req, res) => {
  //   return console.log("missing file ", req.file);
  try {
    const { card_name, card_number, pin, amount } = req.body;
    if (!card_name || !card_number || !pin || !amount) {
      return res.status(400).send("Ensure you fill in the correct files ");
    }
    const result = await Cloudinary.uploader.upload(req.file.path, {
      folder: "Gift-cards",
    });

    const data = await GiftCard.create({
      cardname: card_name,
      cardnumber: card_number,
      pin,
      amount,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Gift card added successfully",
      data,
    });
  } catch (error) {
    console.log("error occured", error);
    return res.status(500).json({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
};

const addAccountDetails = async (req, res) => {
  try {
    const { account_name, account_number, bank_name, save_details } = req.body;

    if (save_details === true) {
      const data = AccountDetails.create({
        account_name,
        account_number,
        bank_name,
      });
      res.send("Beneficiary added successfully");
    }
    if (!account_name || !account_number || !bank_name) {
      return res.json({
        success: false,
        message:
          "Ensure  Account name, Account number and Bank name has been verified",
      });
    }
    const data = GiftCardTransaction.create({
      account_name,
      account_number,
      bank_name,
    });
    return res.json({
      success: true,
      message:
        "Your gift card and bank details has be submitted successfully, You will hear from us immediately we finish verifying your card. ",
      data,
    });
  } catch (error) {
    console.log("Error occured", error);
    return res.json({
      error: true,
      message: "An error occured",
      error: error.message,
    });
  }
};

const allGiftCardTransactions = async (req, res) => {
  try {
    const data = await GiftCardTransaction.findAll();

    if (!data) {
      return res.send("No data found");
    }
    return res.json({
      success: true,
      message: "Giftcard Transactions",
      data,
    });
  } catch (error) {
    console.log("Error occured", error);
    return res.json({
      error: true,
      message: "An error occured",
      error: error.message,
    });
  }
};

module.exports = {
  sellGiftCard,
  addAccountDetails,
  allGiftCardTransactions,
};
