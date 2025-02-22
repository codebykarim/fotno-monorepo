import { log } from "@repo/logger";
import { json, urlencoded } from "body-parser";
import "./bootstrap";
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import AppError from "./errors/AppError";
import routes from "./routes";
import { ErrorMeta } from "./utils/logger";
import { client } from "./mongodb/db";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://www.fotno.com"], // Remove any undefined values
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.all("/api/auth/*", toNodeHandler(auth));

app.use(urlencoded({ extended: true }));
app.use(json());

app.set("trust proxy", true);

// app.use(routes);

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   const errorMeta: ErrorMeta = {
//     url: req.url,
//     body: req.body,
//     agent: req.headers["user-agent"],
//     key: "INTERNAL_SERVER_ERROR",
//     env: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
//   };

//   if (req.user?.id !== undefined) {
//     errorMeta.uid = req.user.id;
//   }

//   if (err instanceof AppError) {
//     errorMeta.code = err.statusCode;
//     errorMeta.key = err.message;
//     // LogError(errorMeta);

//     return res.status(err.statusCode).json({ error: err.message });
//   }

//   errorMeta.code = 500;
//   errorMeta.message = err.message;

//   console.log(errorMeta);

//   // LogError(errorMeta);

//   return res.status(500).json({ error: errorMeta.key });
// });

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

const port = process.env.PORT ?? 8000;

// Connect to DB before starting server
const startServer = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    app.listen(port, () => {
      console.log(`Server started on port: ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Stop the process if DB connection fails
  }
};

startServer();

module.exports = app;
