const express = require("express");
const bodyParser = require("body-parser");

const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const letterWriteRouter = require("./routes/letterWrite");
const myLetterListRouter = require("./routes/myLetterList");
const letterUpdateRouter = require("./routes/letterUpdate");

const app = express();
const PORT = 3000 || process.env.PORT;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/letterWrite", letterWriteRouter);
app.use("/myLetterList", myLetterListRouter);
app.use("/letterUpdate", letterUpdateRouter);

app.get("/main", (req, res) => {
  res.sendFile(__dirname + "/view/main.html");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
