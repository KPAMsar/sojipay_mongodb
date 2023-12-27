const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const SuccessResponse = require("../utils/successResponse");

const StatusCodes = require("../utils/statusCode");

class AuthServices {
  constructor(sequelize) {
    (this.client = sequelize), (this.models = User);
  }

  async login(payload) {
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
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        const userError = new ErrorResponse(
          "Authentication failed, user not found",
          StatusCodes.UNAUTHORIZED
        );
        return res.status(StatusCodes.UNAUTHORIZED).json(userError);
      }

      const isMatched = await user.comparePassword(password);

      if (!isMatched) {
        const matchRes = new ErrorResponse(
          "Authentication failed, password mismatched",
          StatusCodes.UNAUTHORIZED
        );

        return res.status(401).json(matchRes);
      }

      let token = jwt.sign(
        { name: user.name, role: user.role, user: user._id },
        "AzTQ,RP)0(",
        {
          expiresIn: "24h",
        }
      );

      data = {
        email: user.email,
        role: user.role,
        token,
      };

      const successRes = new SuccessResponse(
        "login successful",
        data,
        StatusCodes.OK
      );
    } catch (error) {
      new ErrorResponse(error.message, StatusCodes.SERVER_ERROR);
    }
  }
}

module.exports = AuthServices;
