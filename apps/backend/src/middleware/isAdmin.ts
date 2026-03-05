import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import { auth } from "../auth";
import { fromNodeHeaders } from "better-auth/node";

const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    throw new AppError("Unauthorized", 401);
  }

  if (session.user.role !== "admin") {
    throw new AppError("Forbidden", 403);
  }

  req.user = {
    id: session.user.id,
  };
};

export default isAdmin;
