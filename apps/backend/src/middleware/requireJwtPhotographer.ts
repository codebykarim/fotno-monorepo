import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError";

type PhotographerJwtPayload = JwtPayload & {
  sub?: string;
  role?: string;
  userId?: string;
};

/**
 * Validates a bearer JWT and enforces photographer role access.
 */
const requireJwtPhotographer = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401);
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new AppError("Missing JWT_SECRET", 500);
  }

  let decoded: PhotographerJwtPayload;
  try {
    decoded = jwt.verify(token, jwtSecret) as PhotographerJwtPayload;
  } catch (_error) {
    throw new AppError("Unauthorized", 401);
  }
  const userId = decoded.sub ?? decoded.userId;

  if (!userId) {
    throw new AppError("Invalid token payload", 401);
  }

  if (decoded.role && decoded.role.toLowerCase() !== "photographer") {
    throw new AppError("Forbidden", 403);
  }

  req.user = {
    id: userId,
  };

  next();
};

export default requireJwtPhotographer;
