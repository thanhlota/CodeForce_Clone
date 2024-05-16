const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("<h2>Hello world hihi</h2>");
});

console.log("env", process.env.HOST_PORT);
const port = process.env.HOST_PORT || 7000;

app.listen(port, () => console.log(`listening on port ${port}`));
