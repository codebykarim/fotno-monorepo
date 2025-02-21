import express from "express";
import { log } from "@repo/logger";
import { json, urlencoded } from "body-parser";

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

app.get("/status", (req, res) => {
  log("status");
  res.json({ message: "Express on Vercel" });
});

app.listen(3000, () => log("Server ready on port 3000."));

module.exports = app;
