const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const { generateRequestId } = require("./../controllers/airtimeController");
const TV = require("../models/Tv");

const verifySmartCardNumber = async (req, res) => {
  try {
    const { card_number, service_id } = req.body;
    if (!card_number || !service_id) {
      return res.send("Card number and Service id is required");
    }

    const requestInfo = {
      billersCode: card_number,
      serviceID: service_id,
    };

    const tvTrx = await axios.post(process.env.TV_VERIFY_URL, requestInfo, {
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.VTPASS_API_KEY,
        "secret-key": process.env.VTPASS_API_SK,
      },
    });

    if (tvTrx.data.content.error) {
      return res.json({
        message: "something went wrong wrong ",
        error: tvTrx.data.content.error,
      });
    } else if (!tvTrx.data.content.error) {
      return res.json({
        success: true,
        data: JSON.parse(JSON.stringify(tvTrx.data.content)),
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      error: true,
      message: "An error occured",
      error: error.message,
    });
  }
};

const getDstvPackages = async (req, res) => {
  try {
    const serviceID = req.query.serviceID;
    if (!serviceID) {
      return res.send("ServiceID is required");
    }

    const packageList = await axios.get(
      process.env.VTPASS_TRX_URL + "service-variations?serviceID=" + serviceID,

      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.VTPASS_API_KEY,
          "secret-key": process.env.VTPASS_API_PK,
        },
      }
    );

    if (packageList.data.content.error) {
      return res.json({
        message: "something went wrong wrong ",
        error: dataTrx.data.content.error,
      });
    } else if (!packageList.data.content.error) {
      return res.json({
        success: true,
        data: JSON.parse(JSON.stringify(packageList.data.content)),
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      error: true,
      message: "An error occured",
      error: error.message,
    });
  }
};

const changeBouquet = async (req, res) => {
  try {
    const {
      serviceID,
      card_number,
      variation_code,
      amount,
      phone,
      subscription_type,
      quantity,
    } = req.body;

    if (
      !serviceID ||
      !card_number ||
      !variation_code ||
      !amount ||
      !phone ||
      !subscription_type ||
      !quantity
    ) {
      return res
        .status(400)
        .send(
          "Ensure your serviceID, card number, amount, variation code, phone number, subscription type, and quantity are inputted correctly"
        );
    }

    const requestID = generateRequestId();

    const tvReq = await TV.create({
      request_id: requestID,
      service_id: serviceID,
      billersCode: card_number,
      variation_code,
      amount,
      phone_number: phone,
      subscription_type,
      quantity,
      user: req.user.userId,
    });

    const savedData = tvReq._id;

    const requestInfo = {
      request_id: requestID,
      serviceID,
      billersCode: card_number,
      variation_code,
      amount,
      phone,
      subscription_type,
      quantity,
    };

    const tvTrx = await axios.post(
      process.env.VTPASS_TRX_URL + "pay",
      requestInfo,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.VTPASS_API_KEY,
          "secret-key": process.env.VTPASS_API_SK,
        },
      }
    );

    console.log("res", tvTrx);

    if (tvTrx.data.response_description === "TRANSACTION SUCCESSFUL") {
      await TV.findByIdAndUpdate(savedData, {
        status: "successful",
      });

      return res.json({
        success: true,
        message: "TV subscription was  Successful",
        data: tvTrx.data,
      });
    }
    if (tvTrx.data.response_description === "TRANSACTION FAILED") {
      await TV.findByIdAndUpdate(savedData, {
        status: "failed",
      }).exec();

      return res.json({
        success: false,
        message: "TV subscription  Failed",
        data: tvTrx.data,
      });
    }

    if (
      tvTrx.data.response_description === "TRANSACTION PROCESSING - PENDING"
    ) {
      return res.json({
        success: false,
        message: "TV subscription  Pending",
        data: tvTrx.data,
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      error: true,
      message: "An error occured",
      error: error.message,
    });
  }
};

const renewBouquet = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    return res.json({
      error: true,
      message: "An error occured",
      error: error.message,
    });
  }
};
module.exports = {
  verifySmartCardNumber,
  getDstvPackages,
  changeBouquet,
  renewBouquet,
};
