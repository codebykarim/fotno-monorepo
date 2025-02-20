import pkg from "body-parser";
const { urlencoded } = pkg;
const { json } = pkg;
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(urlencoded({ extended: true }));
app.use(json());

const port = process.env.PORT || 5001;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
