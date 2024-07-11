const Router = require("express");
const {
  handleSignup,
  handleLogin,
  handleForgotPassword,
  handleResetPassword,
} = require("../controller/auth");

const router = Router();

router.post("/signup", handleSignup);

router.post("/login", handleLogin);

router.post("/forgot-password", handleForgotPassword);

router.post("/reset-password", handleResetPassword);

module.exports = router;
