import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../interfaces";
import { auth } from "../auth";
import { fromNodeHeaders } from "better-auth/node";

const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    throw new AppError("Unauthorized");
  }
};

export default isAuth;
