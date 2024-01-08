const GiftCard = require("../models/GiftCard");
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

module.exports = {
  sellGiftCard,
};
