import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import { auth } from "../auth";
import { fromNodeHeaders } from "better-auth/node";
// import { getUserSubscription } from "../services/PaymentServices/getUserSubscription";
// import prisma from "../prisma";

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

  // const subscription = await getUserSubscription(session.user.id);

  // // if subscription next_billing date is over 5 days update user subscribed to false
  // if (
  //   subscription.next_billing < new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  // ) {
  //   await prisma.user.update({
  //     where: {
  //       id: session.user.id,
  //     },
  //     data: {
  //       subscribed: false,
  //     },
  //   });
  //   await auth.api.updateUser({
  //     body: {
  //       subscribed: false,
  //     },
  //   });
  // }

  req.user = {
    id: session.user.id,
  };
};

export default isAuth;
