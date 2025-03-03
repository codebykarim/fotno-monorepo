import axios from "axios";
import { getSubscriptionsPlans } from "./getSubscriptionsPlans";
import AppError from "../../errors/AppError";
import { Session, User } from "better-auth/types";

interface BillingData {
  first_name?: string;
  last_name?: string;
  street?: string;
  phone_number?: string;
  country?: string;
  state?: string;
}

export interface CreateSubscriptionRequest {
  planName: string;
  billing_data: BillingData;
  user?: User;
}

export interface CreateSubscriptionResponse {
  id: string;
  client_secret: string;
  status: string;
  // Add other response fields as needed
}

export const createSubscription = async (
  data: CreateSubscriptionRequest
): Promise<CreateSubscriptionResponse> => {
  try {
    // Get all subscription plans
    const plans = await getSubscriptionsPlans();

    // Find the plan that matches the provided name
    const matchingPlan = plans.find(
      (plan) => plan.name.toUpperCase() === data.planName.toUpperCase()
    );

    console.log(matchingPlan);

    if (!matchingPlan) {
      throw new AppError(
        `No subscription plan found with name: ${data.planName}`
      );
    }

    // Prepare the request data
    const { planName, ...subscriptionData } = data;
    const finalData = {
      amount: matchingPlan.amount_cents,
      currency: "EGP",
      payment_methods: [matchingPlan.integration],
      subscription_plan_id: matchingPlan.id,
      billing_data: {
        first_name: data.billing_data?.first_name,
        last_name: data.billing_data?.last_name,
        phone_number: data.billing_data.phone_number,
        email: data.user?.email,
        country: data.billing_data.country,
        state: data.billing_data.state,
        street: data.billing_data.street,
      },
      items: [
        {
          name: planName,
          quantity: 1,
          amount: matchingPlan.amount_cents,
          description:
            planName == "BEGGINER"
              ? "Good for anyone who is self-employed and just getting started."
              : planName == "PRO"
                ? "Perfect for small / medium sized businesses."
                : "Perfect for small / medium sized businesses.",
        },
      ],
    };

    const response = await axios.post(
      "https://accept.paymob.com/v1/intention/",
      finalData,
      {
        headers: {
          Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response data:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Full error response:",
        JSON.stringify(error.response?.data, null, 2)
      );
      throw new AppError(
        `Failed to create subscription: ${error.response?.data?.detail || error.response?.data?.message || error.message}`
      );
    }
    throw error;
  }
};

// Helper function to generate checkout URL
export const generateCheckoutUrl = (
  publicKey: string,
  clientSecret: string
): string => {
  return `https://accept.paymob.com/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${clientSecret}`;
};
