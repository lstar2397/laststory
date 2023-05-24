const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();

const PORT = 3000 || process.env.PORT;

app.use(express.static(__dirname + "/public"));

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/view/login.html");
});

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/view/signup.html");
});

app.post("/signup", async (req, res) => {
  try {
    const response = await axios
      .post("http://localhost:5000/sign_up", {
        username: req.body.username,
        password: req.body.password,
        nickname: req.body.nickname,
        email: req.body.email,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/main", (req, res) => {
  res.sendFile(__dirname + "/view/main.html");
});

app.get("/letterWirte", (req, res) => {
  res.sendFile(__dirname + "/view/letterWirte.html");
});

app.get("/myLetterList", (req, res) => {
  res.sendFile(__dirname + "/view/myLetterList.html");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
