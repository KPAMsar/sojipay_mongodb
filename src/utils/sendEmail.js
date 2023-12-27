const nodemailer = require("nodemailer");
const { OTP_SENDER_EMAIL } = require("../config/index");
const dotenv = require("dotenv");
dotenv.config();

exports.verifyEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: config.SERVICE,
      secure: true,
      auth: {
        pass: config.PASSMAILER,
        user: process.env.OTP_SENDER_EMAIL,
      },
    });

    await transporter.sendMail({
      from: OTP_SENDER_EMAIL,
      to: email,
      subject: " HARAF EDMS Reset Password",
      html: ` <b> Hi Dear </b></br>
          <p>We recieved a request to verify your email on SojiPay Account.</p>
          </br>
          <p>Please enter this code to complete your email verification.</p>
          </br>
          </br>
          <b>${otp}</b>
          </br>
          </br>
          <p>Thanks for helping us keep your account secure. </p>`,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

exports.Otp_ForgotPassword = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        pass: "zabb wtba gahz pxpc",
        user: "kpamdev@gmail.com",
      },
    });

    await transporter.sendMail({
      from: process.env.OTP_SENDER_EMAIL,
      to: email,
      subject: " SojiPay Reset Password",
      html: ` <b> Hi Dear </b></br>
        <p>We recieved a request to reset the Password on your SojiPay Service Account.</p>
        </br>
        <p>Please enter this code to complete password reset.</p>
        </br>
        </br>
        <b>${otp}</b>
        </br>
        </br>
        <p>Thanks for helping us keep your account secure. </p>`,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};
// module.exports = mailSender;
