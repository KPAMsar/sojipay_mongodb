const AirtimePurchase = require("../models/AirtimePurchase");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const generateRequestId = () => {
  const pad = (number) => (number < 10 ? `0${number}` : `${number}`);
  const currentDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" })
  );

  const year = currentDate.getFullYear();
  const month = pad(currentDate.getMonth() + 1);
  const day = pad(currentDate.getDate());
  const hours = pad(currentDate.getHours());
  const minutes = pad(currentDate.getMinutes());

  return `${year}${month}${day}${hours}${minutes}`;
};

const purchaseAirtime = async (req, res) => {
  try {
    const { amount, phone, serviceID } = req.body;
    if (!amount || !phone) {
      return res.send("Enter phone number and amount");
    }

    const requestId = generateRequestId();

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

    console.log(airtimeTrx.data);

    if (airtimeTrx.data.response_description === "TRANSACTION SUCCESSFUL") {
      console.log("erer");
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
  purchaseAirtime,
};
