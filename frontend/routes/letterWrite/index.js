require("dotenv").config();
const { BACKEND_URL } = process.env;

const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile("./view/letterWrite.html", { root: __dirname + "../../../" });
});

// router.get("/writeUpdate", (req, res) => {
//   res.sendFile("./view/letterWrite.html", { root: __dirname + "../../../" });
// });

router.post("/tempSave", async (req, res) => {
  try {
    const { title, encrypted, token } = req.body;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(
      `${BACKEND_URL}/tempSave`,
      {
        title,
        encrypted,
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

router.post("/getTargetMetamaskAdr", async (req, res) => {
  try {
    const { publicTarget } = req.body;

    const response = await axios.post(`${BACKEND_URL}/getTargetMetamaskAdr`, {
      publicTarget,
    });
    const { result, metamask_address } = response.data;

    if (result === "success") {
      res
        .status(200)
        .json({ state: 200, metamask_address, message: "주소 조회 성공" });
    } else {
      res.status(400).json({ state: 400, message: "주소 조회 실패" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
