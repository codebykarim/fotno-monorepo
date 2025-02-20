import express, { Request, Response } from "express";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import logger from "../../../packages/logger/dist/index.js";

const app = express();

app.use(cors());

app.use(urlencoded({ extended: true }));
app.use(json());

const port = process.env.PORT || 5001;

app.get("/", (req: Request, res: Response) => {
  logger.log("Hello World");
  res.json({
    message: "Hello World",
  });
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
