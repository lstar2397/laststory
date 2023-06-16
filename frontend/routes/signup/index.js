require("dotenv").config();
const { BACKEND_URL } = process.env;

const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile("./view/signup.html", { root: __dirname + "../../../" });
});

router.post("/", async (req, res) => {
  try {
    const { username, password, nickname, metamask_address, email, auth } =
      req.body;

    console.log(req.body);
    const response = await axios.post(`${BACKEND_URL}/sign_up`, {
      username,
      password,
      nickname,
      metamask_address,
      email,
      auth,
    });
    const { result } = response.data;

    if (result === "success") {
      res.redirect("/login");
    } else {
      res.redirect("/signup");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/authentication", async (req, res) => {
  try {
    const { username, email } = req.body;
    const response = await axios.post(`${BACKEND_URL}/authentication`, {
      username,
      email,
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
