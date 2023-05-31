const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile("./view/signup.html", { root: __dirname + "../../../" });
});

router.post("/signup", async (req, res) => {
    try {
      const response = await axios
        .post("http://localhost:5001/sign_up", {
          username: req.body.username,
          password: req.body.password,
          nickname: req.body.nickname,
          email: req.body.email,
        })
        .then((res_server) => {
          if (res_server.data.result === "success") {
            res.redirect("http://localhost:3000/login");
          } else if (res_server.data.result === "fail") {
            res.redirect("http://localhost:3000/signup");
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
