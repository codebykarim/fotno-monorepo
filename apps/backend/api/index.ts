const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.get("/", (req, res) =>
  res.send({
    message: "Hello World",
  })
);

app.listen(3000, () => console.log("Server ready on port 3000."));

export default app;
