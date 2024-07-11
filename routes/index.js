const express = require("express");
const router = express.Router();
const authRouter = require("./auth");

// Test Hello World Route
router.get("/hello-world", function (req, res) {
  res.json({ message: "Hello World!" });
});

//Auth routes
router.use("/auth", authRouter);

// Export the router
module.exports = router;
