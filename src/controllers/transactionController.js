const { StatusCodes } = require("http-status-codes");
const otpGenerator = require("otp-generator");
const User = require("../models/User");
const TransactionPIN = require("../models/TransactionPIN");
const { sendPINConfirmationEmail } = require("./emailService");

const setTransactionPIN = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the user already has a transaction PIN
    const existingPIN = await TransactionPIN.findOne({ where: { userId } });

    if (existingPIN) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Transaction PIN already set for the user",
      });
    }

    // Generate a random PIN (4 digits in this example)
    const transactionPIN = otpGenerator.generate(4, {
      digits: true,
      alphabets: false,
      specialChars: false,
    });

    // Save the transaction PIN in the database
    const newTransactionPIN = await TransactionPIN.create({
      userId,
      pin: transactionPIN,
    });

    // Send the PIN to the user for confirmation
    await sendPINConfirmationEmail(
      user.email,
      "Transaction PIN Confirmation",
      `Your transaction PIN is: ${transactionPIN}`
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message:
        "Transaction PIN set successfully. Check your email for confirmation.",
    });
  } catch (error) {
    console.error(error);

    res.status(StatusCodes.SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
      error: error.errors,
    });
  }
};

module.exports = { setTransactionPIN };
