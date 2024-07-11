require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");

//MIDDLEWARES
const app = express();
app.use(cors());
app.use(express.json());

//ROUTES
const routes = require("./routes");
app.use("/api/", routes);

//SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//CONNECT TO DB
connectDB();
