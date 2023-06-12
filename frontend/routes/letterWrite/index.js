require("dotenv").config();
const { BACKEND_URL } = process.env;

const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile("./view/letterWrite.html", { root: __dirname + "../../../" });
});

router.post("/tempSave", async (req, res) => {
  try {
    const { title, encrypted } = req.body;

    const response = await axios.post(`${BACKEND_URL}/tempSave`, {
      title,
      encrypted,
    });
    const { result } = response.data;

    if (result === "success") {
      res.status(200).json({ result: "success" });
    } else {
      res.status(400).json({ result: "fail" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
