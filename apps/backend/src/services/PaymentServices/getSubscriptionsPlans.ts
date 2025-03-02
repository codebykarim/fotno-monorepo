import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken } from "./getToken";
import AppError from "../../errors/AppError";

interface PaymobPlan {
  is_active: boolean;
  [key: string]: any;
}

interface PaymobResponse {
  results: PaymobPlan[];
  next: string | null;
}

export const getSubscriptionsPlans = async () => {
  const authToken = await getToken();

  if (!authToken) {
    throw new AppError("Failed to get auth token");
  }

  let allPlans: PaymobPlan[] = [];
  let nextPageUrl: string | null =
    "https://accept.paymob.com/api/acceptance/subscription-plans";

  while (nextPageUrl) {
    const options: AxiosRequestConfig = {
      method: "GET",
      url: nextPageUrl,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    try {
      const response: AxiosResponse<PaymobResponse> = await axios(options);
      const activePlans = response.data.results.filter(
        (plan) => plan.is_active
      );
      allPlans = [...allPlans, ...activePlans];

      // Update nextPageUrl for the next iteration
      nextPageUrl = response.data.next;
    } catch (error) {
      throw new AppError("Failed to list subscription plans");
    }
  }

  return allPlans;
};
