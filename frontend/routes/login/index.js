require("dotenv").config();
const { BACKEND_URL } = process.env;

const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
  res.sendFile("./view/login.html", { root: __dirname + "../../../" });
  // const response = await axios.get(`${BACKEND_URL}/login`);
  // // const { result } = response.data;
  // // if (result === "fail") {
  // //   res.sendFile("./view/login.html", { root: __dirname + "../../../" });
  // // } else {
  // //   res.sendFile("./view/main.html", { root: __dirname + "../../../" });
  // // }
});

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await axios.post(`${BACKEND_URL}/login`, {
      username,
      password,
    });

    if (response.data.result === "success") {
      res.send({
        state: 200,
        message: "로그인성공",
        accessToken: response.data.access_token,
      });
    } else {
      res.send({ state: 400, message: "로그인실패" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
