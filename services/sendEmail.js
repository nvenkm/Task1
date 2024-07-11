const nodemailer = require("nodemailer");

async function sendForgotPasswordEmail(email, resetPasswordToken) {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASS,
    },
  });

  let mailDetails = {
    from: process.env.EMAIL,
    to: email,
    subject: "Reset Password Instructions",
    html: `
      <h1>Reset your password</h1>
      <p>Click the link below to reset your password</p>
      <a class="button" href="${process.env.BASE_URL}/api/auth/reset-password/?email=${email}&resetPasswordToken=${resetPasswordToken}">Reset Password</a>
      `,
  };

  const sent = await mailTransporter.sendMail(mailDetails);

  return sent;
}

module.exports = sendForgotPasswordEmail;
