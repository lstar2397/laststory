require("dotenv").config();
const { BACKEND_URL } = process.env;

const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile("./view/letterUpdate.html", { root: __dirname + "../../../" });
});

router.post("/tempUpdate", async (req, res) => {
  try {
    const { title, encrypted, token, postId } = req.body;

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.post(
      `${BACKEND_URL}/tempUpdate`,
      {
        title,
        encrypted,
        postId,
      },
      { headers }
    );
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
