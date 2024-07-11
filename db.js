const mongoose = require("mongoose");
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Database successfully!");
  } catch (error) {
    console.log("Connection to Database failed!", error);
  }
}

module.exports = { connectDB };
