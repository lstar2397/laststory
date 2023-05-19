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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
