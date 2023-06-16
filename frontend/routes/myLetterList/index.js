require("dotenv").config();
const { BACKEND_URL } = process.env;

const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile("./view/myLetterList.html", { root: __dirname + "../../../" });
});

router.post("/getList", async (req, res) => {
  try {
    const { token } = req.body;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(`${BACKEND_URL}/myPost`, {}, { headers });

    const { result, myPost } = response.data;

    if (result === "success") {
      res.status(200).json({ result: "success", myPost });
    } else {
      res.status(400).json({ result: "fail" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { token, postid, confirm } = req.body;
    console.log(token, postid, confirm);
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(
      `${BACKEND_URL}/myPost/delete`,
      { postid, confirm },
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
