require("dotenv").config();
const { BACKEND_URL } = process.env;

const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile("./view/login.html", { root: __dirname + "../../../" });
});

router.post("/", async (req, res) => {
    try {
        const response = await axios
            .post(`${BACKEND_URL}/login`, {
                username: req.body.username,
                password: req.body.password,
            })
            .then((res) => {
                console.log(res.data.result);
                if (res.data.result === "success") {
                    res.redirect("/main");
                } else if (res.data.result === "fail") {
                    res.redirect("/login");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
