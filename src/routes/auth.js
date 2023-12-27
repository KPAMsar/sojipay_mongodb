const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/auth");

const AuthController = require("../controllers/authController");

router.post("/login", AuthController.Login);
router.post("/sign-up", AuthController.SignUp);
router.post("/change-password", Auth, AuthController.changePassword);
router.post("/forgot-password", Auth, AuthController.ForgotPassword);
router.post("/verify-email", Auth, AuthController.verifyEmail);
router.post(
  "/send-verification-email",
  Auth,
  AuthController.sendVerificationEmail
);

module.exports = router;
