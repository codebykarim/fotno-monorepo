import { auth } from "../../auth";
import { fromNodeHeaders } from "better-auth/node";
import { Request } from "express";

export const impersonateUser = async (userId: string, req: Request) => {
  const result = await auth.api.impersonateUser({
    body: { userId },
    headers: fromNodeHeaders(req.headers),
  });
  return result;
};
