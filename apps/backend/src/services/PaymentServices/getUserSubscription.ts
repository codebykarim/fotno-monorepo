import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken } from "./getToken";
import AppError from "../../errors/AppError";
import prisma from "../../prisma";

export const getUserSubscription = async (userId: string) => {
  const authToken = await getToken();

  if (!authToken) {
    throw new AppError("Failed to get auth token");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      payment: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!user) {
    throw new AppError("User not found");
  }

  if (!user.payment || user.payment.length === 0) {
    throw new AppError("User has no payment information");
  }

  const planId = user.payment[0].planId;

  if (!planId) {
    throw new AppError("User has no plan assigned");
  }

  const options: AxiosRequestConfig = {
    method: "GET",
    url: `https://accept.paymob.com/api/acceptance/subscriptions/${planId}`,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const response: AxiosResponse = await axios(options);
    return response.data;
  } catch (error) {
    throw new AppError("Failed to get user subscription");
  }
};
