const ErrorResponse = require("../utils/errorResponse");
const SuccessResponse = require("../utils/successResponse");
const StatusCodes = require("../utils/statusCode");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const ValidateRequestBody = require("../services/validateServices");
const jwt = require("jsonwebtoken");
const { Otp_ForgotPassword } = require("../utils/sendEmail");
const OTP = require("../models/OTP");

const otpGenerator = require("otp-generator");

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Email field is required",
      });
    }

    if (!password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Password field is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Authentication failed, user not found",
      });
    }

    const isMatched = await user.comparePassword(password);

    if (!isMatched) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Authentication failed, password mismatched",
      });
    }

    const token = jwt.sign(
      { name: user.name, role: user.role, userId: user.id },
      "AzTQ,RP)0(",
      {
        expiresIn: "24h",
      }
    );

    const data = {
      email: user.email,
      role: user.role,
      token,
    };

    return res.status(StatusCodes.OK).json({
      message: "Login successful",
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(StatusCodes.SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
};

const SignUp = async (req, res) => {
  try {
    const { first_name, last_name, email, phone_number, password } = req.body;
    const requiredFields = [
      first_name,
      last_name,
      email,
      phone_number,
      password,
    ];

    if (!first_name) {
      return res.send("First name is required");
    }
    if (!last_name) {
      return res.send("Last name is required");
    }
    if (!email) {
      return res.send("Email  is required");
    }
    if (!phone_number) {
      return res.send("Phone number is required");
    }
    if (!password) {
      return res.send("Password is required");
    }

    const findEmail = await User.findOne({ email: email }).exec();

    if (findEmail) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "Email is already taken by another user",
      });
    }
    const findNum = await User.findOne({ phone_number }).exec();

    if (findNum) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "Phone number is already taken by another user",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      first_name,
      last_name,
      email: email.toLowerCase().trim(),
      phone_number,
      password: hashedPassword,
    });

    const saveBiodata = await newUser.save();

    return res.status(200).json({
      success: true,
      message: "User registered successfully!",
      data: {
        _id: saveBiodata._id,
        first_name: saveBiodata.first_name,
        last_name: saveBiodata.last_name,
        email: saveBiodata.email,
        phone_number: saveBiodata.phone_number,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(StatusCodes.SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const ForgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    console.log("req user", req.user);
    if (!email) {
      return res.json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "failed",
        error: "This Email does not exist.",
      });
    }

    const code = otpGenerator.generate(4, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const otpExpirationTime = new Date();
    otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 15);

    const otp = new OTP({
      user: user.id,
      code,
      type: "ForgotPassword",
      expiresIn: otpExpirationTime,
    });

    const saveOtp = await otp.save();

    const resetLink = `http://your-website.com/reset-password?token=${otp.code}`;

    const data = await Otp_ForgotPassword("kpamsarshija@gmail.com", otp.code);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password reset link sent successfully",
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(StatusCodes.SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatched = await user.comparePassword(oldPassword);

    if (!isMatched) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid old password",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(StatusCodes.SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const sendVerificationEmail = async (req, res) => {
  try {
    // console.log("ee", req.user);
    const email = req.body.email;
    if (!email) {
      return res.json({
        success: false,
        message: "Email field is required",
      });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    const code = otpGenerator.generate(4, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const otpExpirationTime = new Date();
    otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 15);

    const otp = new OTP({
      user: user.id,
      code,
      type: "emailVerification",
      expiresIn: otpExpirationTime,
    });

    const saveOtp = await otp.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Email verfication code sent successfully",
      data: saveOtp,
    });
  } catch (error) {
    console.error(error);

    return res.status(StatusCodes.SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    // Find the user based on the provided email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found for the provided email",
      });
    }

    // Find the corresponding OTP record for the user and the provided code
    const otpRecord = await OTP.findOne({
      user: user.id,
      code,
      type: "emailVerification",
    });

    if (!otpRecord || otpRecord.expiresIn < new Date()) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isEmailVerified = true;
    await user.save();

    // Delete the used OTP record
    await otpRecord.deleteOne();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Email verified successful",
    });
  } catch (error) {
    console.error(error);

    res.status(StatusCodes.SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getLoggedInUser = async (req, res) => {
  const userDetails = req.user;
  return res.json({ user: userDetails });
};

module.exports = {
  verifyEmail,
  SignUp,
  sendVerificationEmail,
  Login,
  changePassword,
  getLoggedInUser,
  ForgotPassword,
};
