import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();
connectDB();

const app = express();

app.get("/", (req, res) => {
  res.send("Api is running...");
});

const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${NODE_ENV} mode`.yellow.bold
  );
});
