require("dotenv").config();
const { BACKEND_URL } = process.env;

const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
  const response = await axios.get(`${BACKEND_URL}/login`);
  const { result } = response.data;
  if (result === "fail") {
    res.sendFile("./view/login.html", { root: __dirname + "../../../" });
  } else {
    res.sendFile("./view/main.html", { root: __dirname + "../../../" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await axios.post(`${BACKEND_URL}/login`, {
      username,
      password,
    });
    const { result } = response.data;

    if (result === "success") {
      res.redirect("/main");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/logout", async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/logout`);
    const { result } = response.data;

    if (result === "success") {
      res.send({ result: "success" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
