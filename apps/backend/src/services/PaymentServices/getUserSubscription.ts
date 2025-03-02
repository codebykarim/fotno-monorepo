import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken } from "./getToken";
import AppError from "../../errors/AppError";
import { User } from "../../models/UserModel";
import { PaymentShemaType } from "../../models/PaymentModel";

export const getUserSubscription = async (userId: string) => {
  const authToken = await getToken();

  if (!authToken) {
    throw new AppError("Failed to get auth token");
  }

  const user = await User.findById(userId)
    .populate<{ payment: PaymentShemaType }>("payment")
    .exec();

  if (!user) {
    throw new AppError("User not found");
  }

  if (!user.payment) {
    throw new AppError("User has no payment information");
  }

  const planId = user.payment.planId;

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
