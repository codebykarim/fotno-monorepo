import { json, urlencoded } from "body-parser";
import "./bootstrap";
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import AppError from "./errors/AppError";
import routes from "./routes";
import { ErrorMeta } from "./utils/logger";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import path from "path";
import { ZodError } from "zod";
import { startCleanupWorker } from "./workers/cleanupPhotoWorker";
import { startExpiryWorker } from "./workers/expiryWorker";
import Sentry from "./sentry";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://localhost:3004",
      "https://www.fotno.com",
      "https://fotno.com",
      "https://auth.fotno.com",
      "https://admin.fotno.com",
      "https://gallery.fotno.com",
      "https://api.fotno.com",
      "https://upload.fotno.com",
      "https://app.fotno.com",
      "https://gallery.fotno.com",
    ], // Remove any undefined values
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Custom reset password handler - must come BEFORE the better-auth handler
app.get("/api/auth/reset-password/:token", (req: Request, res: Response) => {
  const token = req.params.token;
  const email = req.query.email;

  if (!token) {
    return res.status(400).json({ error: "Missing reset token" });
  }
  console.log("Token:", token, "Email:", email);
  const redirectUrl = `${process.env.NEXT_PUBLIC_AUTH_URL}/reset-password?token=${token}&email=${email}`;
  res.redirect(redirectUrl);
});

app.all("/api/auth/*", toNodeHandler(auth));

app.use(urlencoded({ extended: true }));
app.use(
  json({
    strict: false,
    verify: (req: any, _res, buf) => {
      // Capture raw body for webhook signature verification
      if (
        req.url?.includes("/billing/webhook") ||
        req.url?.includes("/email/webhook")
      ) {
        req.rawBody = buf;
      }
    },
  }),
);

app.set("trust proxy", true);

// Sentry: tag each request with user context
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.id) {
    Sentry.setUser({ id: req.user.id });
  }
  next();
});

app.use(routes);

// Sentry error handler — must be before our custom error handler
Sentry.setupExpressErrorHandler(app);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  const errorMeta: ErrorMeta = {
    url: req.url,
    body: req.body,
    agent: req.headers["user-agent"],
    key: "INTERNAL_SERVER_ERROR",
    env: process.env.NODE_ENV as "development" | "production" | "test",
  };

  if (req.user?.id !== undefined) {
    errorMeta.uid = req.user.id;
  }

  if (err instanceof AppError) {
    errorMeta.code = err.statusCode;
    errorMeta.key = err.message;

    // Only send 5xx AppErrors to Sentry (not expected 4xx)
    if (err.statusCode >= 500) {
      Sentry.captureException(err, {
        tags: { route: req.route?.path || req.url },
        extra: { userId: req.user?.id },
      });
    }

    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Invalid request body",
      issues: err.issues,
    });
  }

  const error = err instanceof Error ? err : new Error("Unknown error");
  errorMeta.code = 500;
  errorMeta.message = error.message;

  // Capture all unhandled 500s in Sentry with full context
  Sentry.captureException(error, {
    tags: { route: req.route?.path || req.url },
    extra: { userId: req.user?.id, url: req.url },
  });

  console.log(errorMeta);

  return res.status(500).json({ error: errorMeta.key });
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome To Fotno API" });
});

app.get("/favicon.ico", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../favicon.ico"));
});


const port = process.env.PORT ?? 8000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});

if (process.env.PHOTO_WORKER_IN_API !== "false") {
  startCleanupWorker().catch((error) => {
    console.error("Failed to start cleanup worker", error);
  });
  startExpiryWorker().catch((error) => {
    console.error("Failed to start expiry worker", error);
  });
}

module.exports = app;
