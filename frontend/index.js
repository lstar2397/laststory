const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");

const app = express();
const PORT = 3000 || process.env.PORT;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/login", loginRouter);
app.use("/signup", signupRouter);

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
