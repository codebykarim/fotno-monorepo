import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken } from "./getToken";
import AppError from "../../errors/AppError";
import { prisma } from "@workspace/db";

export const getUserSubscription = async (userId: string) => {
  const authToken = await getToken();

  if (!authToken) {
    throw new AppError("Failed to get auth token");
  }

  const payment = await prisma.payment.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!payment) {
    throw new AppError("Payment not found");
  }

  const subscriptionId = payment.subscriptionId;

  if (!subscriptionId) {
    throw new AppError("User has no plan assigned");
  }

  const options: AxiosRequestConfig = {
    method: "GET",
    url: `https://accept.paymob.com/api/acceptance/subscriptions/${subscriptionId}`,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const response: AxiosResponse = await axios(options);
    return response.data;
  } catch (error: any) {
    throw new AppError("Failed to get user subscription");
  }
};
