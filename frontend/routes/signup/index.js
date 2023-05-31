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
        const { username, password, nickname, email } = req.body;
        const response = await axios.post(`${BACKEND_URL}/sign_up`, { username, password, nickname, email });
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

module.exports = router;
