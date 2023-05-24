const express = require("express");
const app = express();

const PORT = 3000 || process.env.PORT;

app.use(express.static(__dirname + "/public"));

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/view/login.html");
});

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/view/signup.html");
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
