require("dotenv").config();
const { BACKEND_URL } = process.env;

const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile("./view/letterWrite.html", { root: __dirname + "../../../" });
});

module.exports = router;
