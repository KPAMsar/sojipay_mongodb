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
    const { amount, phone, service_id, variation_code } = req.body;
    if (!amount || !phone || !service_id || !variation_code) {
      return res.send(
        "Ensure phone number,amount, service ID, and variation code is entered successfully"
      );
    }

    const requestId = generateRequestId();

    const dataReq = await DataPurchase.create({
      request_id: requestId,
      service_id,
      variation_code,
      amount: Number(amount),
      phone_number: Number(phone),
      user: req.user.userId,
    });

    const savedData = dataReq._id;

    const requestInfo = {
      variation_code,
      request_id: requestId,
      serviceID: service_id,
      amount,
      billersCode: phone,
      phone,
    };

    const dataTrx = await axios.post(
      process.env.AIRTIME_PURCHASE_LINK,
      requestInfo,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.VTPASS_API_KEY,
          "secret-key": process.env.VTPASS_API_SK,
        },
      }
    );

    // return console.log("dataTrx.data", dataTrx.data.status);
    if (dataTrx.data.response_description === "TRANSACTION SUCCESSFUL") {
      await DataPurchase.findByIdAndUpdate(savedData, {
        status: "successful",
      });

      return res.json({
        success: true,
        message: "Data recharge  Successful",
        data: dataTrx.data,
      });
    }
    if (dataTrx.data.response_description === "TRANSACTION FAILED") {
      await DataPurchase.findByIdAndUpdate(savedData, {
        status: "failed",
      }).exec();

      return res.json({
        success: false,
        message: "Data recharge Failed",
        data: dataTrx.data,
      });
    }
    return dataTrx.data;
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
