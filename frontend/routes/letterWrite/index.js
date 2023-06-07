require("dotenv").config();
const { BACKEND_URL } = process.env;

const express = require("express");
const axios = require("axios");

const router = express.Router();


router.post("/tempWrite", async (req, res) => {
    try {
        const {title, content} = req.body;
        const response = await axios.post(`${BACKEND_URL}/tempWrite`, {title, content});
        const { result } = response.data;

        if (result === "success") {
            res.redirect("/main");
        } else {
            res.redirect("/letterWrite");
        } 
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

