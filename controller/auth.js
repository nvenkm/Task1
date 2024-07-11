const User = require("../models/User");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendForgotPasswordEmail = require("../services/sendEmail");
const { signupSchema, loginSchema } = require("../services/validation");

async function handleSignup(req, res) {
  try {
    const { username, email, password } = req.body;

    //Validate the fields
    const result = signupSchema.safeParse({ username, email, password });
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    //Check if the user with the same email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    //Check if the username is already taken
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username is already taken" });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create a jwt token
    const accessToken = jwt.sign(
      { username: username, email: email },
      process.env.JWT_SECRET
    );

    //Create and save user if email and username are unique
    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
      accessToken: accessToken,
    });
    const savedUser = await user.save();

    //send the token
    res.json({ success: true, token: savedUser.accessToken });
  } catch (error) {
    console.log(error);
  }
}

async function handleLogin(req, res) {
  try {
    const { username, password } = req.body;

    //Validate the fields
    const result = loginSchema.safeParse({ username, password });
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    //Find the user
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    //Check the password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    //Send the token
    const accessToken = jwt.sign(
      { username: username, email: existingUser.email },
      process.env.JWT_SECRET
    );

    res.json({
      success: true,
      message: "Logged in successfully",
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
  }
}

async function handleForgotPassword(req, res) {
  try {
    const { email } = req.body;

    const validEmail = z.string().email({ message: "Invalid email address" });
    const result = validEmail.safeParse(email);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    //find the user
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    //Create and save reset password token
    const resetPasswordToken = jwt.sign(
      { email: email },
      process.env.JWT_SECRET
    );
    existingUser.resetPasswordToken = resetPasswordToken;
    await existingUser.save();

    const sent = await sendForgotPasswordEmail(email, resetPasswordToken);

    if (sent) {
      // console.log(sent);
      return res.status(200).json({
        success: true,
        message: `Password reset instructions sent to ${email} successfully`,
      });
    }
    return res.status(400).json({
      success: false,
      message: `Please try again after sometime`,
    });
  } catch (error) {
    console.log(error);
  }
}

async function handleResetPassword(req, res) {
  try {
    const { email, resetPasswordToken, newPassword } = req.body;
    // console.log({ email, resetPasswordToken });

    //find the user with these credentials
    const existingUser = await User.findOne({
      email: email,
      resetPasswordToken: resetPasswordToken,
    });
    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashedPassword;

    //reset the token
    existingUser.resetPasswordToken = null;

    await existingUser.save();
    res
      .status(200)
      .json({ success: true, message: "Password changed.You can login now" });
  } catch (error) {
    console.log("ERROR Resetting the password", error);
  }
}

module.exports = {
  handleSignup: handleSignup,
  handleLogin: handleLogin,
  handleForgotPassword: handleForgotPassword,
  handleResetPassword: handleResetPassword,
};
