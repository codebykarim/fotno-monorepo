import { json, urlencoded } from "body-parser";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(urlencoded({ extended: true }));
app.use(json());

const port = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
