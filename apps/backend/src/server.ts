import express, { Request, Response } from "express";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import { test } from "./test";

const app = express();

app.use(cors());

app.use(urlencoded({ extended: true }));
app.use(json());

const port = process.env.PORT || 5001;

app.get("/status", (req: Request, res: Response) => {
  test();
  res.json({
    message: "Hello World",
  });
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
