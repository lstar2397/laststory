require("dotenv").config();
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile("./view/readLetter.html", { root: __dirname + "../../../" });
});

module.exports = router;
