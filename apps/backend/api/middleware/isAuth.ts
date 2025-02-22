import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../interfaces";

const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("ERR_SESSION_EXPIRED", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const decodedToken = decoded as TokenPayload;

    req.user = {
      authId: decodedToken?.sub,
      identitynumber: decodedToken?.user_metadata.identitynumber,
      id: decodedToken?.user_metadata.id,
    };
  } catch (err) {
    throw new AppError("ERR_INVALID_TOKEN", 401);
  }
};

export default isAuth;
