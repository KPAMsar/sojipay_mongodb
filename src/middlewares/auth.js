const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, "AzTQ,RP)0(");

    // console.log("decode", decode);
    req.user = decode;

    next();
  } catch (error) {
    res.status(403).json({
      message: "Authentication Failed!",
    });
  }
};

module.exports = authenticate;
