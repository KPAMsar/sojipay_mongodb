const { generateRequestId } = require("./../controllers/airtimeController");
const DataPurchase = require("../models/DataPurchase");
const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");

const getDataList = async (req, res) => {
  try {
    const serviceID = req.query.serviceID;

    if (!serviceID) {
      return res.status(400).send("Bad Request: Service ID not found");
    }

    const url = process.env.DATA_PURCHASE_LIST;

    const dataList = await axios.get(
      url + serviceID,

      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.VTPASS_API_KEY,
          "secret-key": process.env.VTPASS_API_PK,
        },
      }
    );

    if (dataList.status === 200) {
      return res.status(200).json({
        success: true,
        message: "List of data",
        data: dataList.data.content.varations,
      });
    } else {
      return res.send("Something went wrong");
    }
  } catch (error) {
    console.log("Error occured", error);
    return res.json({
      error: true,
      message: "An error occured",
      error: error.message,
    });
  }
};

const purchaseData = async (req, res) => {
  try {
    const { amount, phone, serviceID } = req.body;
    if (!amount || !phone) {
      return res.send("Enter phone number and amount");
    }

    const requestId = generateRequestId();

    // return console.log("reqid", requestId);
    const airtimeReq = await AirtimePurchase.create({
      request_id: requestId,
      service_id: serviceID,
      amount: Number(amount),
      phone_number: Number(phone),
      user: req.user.userId,
    });

    const savedAirtime = airtimeReq._id;

    const airtimeReqData = {
      request_id: requestId,
      serviceID: serviceID,
      amount,
      phone: phone,
    };

    const airtimeTrx = await axios.post(
      process.env.AIRTIME_PURCHASE_LINK,
      airtimeReqData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.VTPASS_API_KEY,
          "secret-key": process.env.VTPASS_API_SK,
        },
      }
    );

    // console.log(airtimeTrx.data);

    if (airtimeTrx.data.response_description === "TRANSACTION SUCCESSFUL") {
      //   console.log("erer");
      await AirtimePurchase.findByIdAndUpdate(savedAirtime, {
        status: "successful",
      });

      return res.json({
        success: true,
        message: "Recharge Successful",
        data: airtimeTrx.data,
      });
    }
    if (airtimeTrx.data.response_description === "TRANSACTION FAILED") {
      await AirtimePurchase.findByIdAndUpdate(savedAirtime, {
        status: "failed",
      }).exec();

      return res.json({
        success: false,
        message: "Recharge Failed",
        data: airtimeTrx.data,
      });
    }
    return airtimeTrx.data;
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
  purchaseData,
  getDataList,
};
