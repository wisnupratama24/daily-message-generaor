const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

require("dotenv").config({
  path: "config/config.env",
});
connectDB();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );
  app.use(morgan("dev"));
}

const authRouter = require("./routes/dailyroute");

app.use("/api", authRouter);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "page not found",
  });
});
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
