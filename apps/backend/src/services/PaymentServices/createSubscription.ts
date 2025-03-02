import axios from "axios";
import { getSubscriptionsPlans } from "./getSubscriptionsPlans";
import AppError from "../../errors/AppError";

interface BillingData {
  apartment: string;
  first_name: string;
  last_name: string;
  street: string;
  building: string;
  phone_number: string;
  country: string;
  email: string;
  floor: string;
  state: string;
}

export interface CreateSubscriptionRequest {
  planName: string;
  billing_data: BillingData;
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
      ...subscriptionData,
      subscription_plan_id: matchingPlan.id,
      amount: matchingPlan.amount_cents,
      currency: "EGP",
      payment_methods: [matchingPlan.integration],
      subscription_start_date: new Date().toISOString().slice(0, 10),
      items: [
        {
          name: `Subscription to ${planName}`,
          amount: matchingPlan.amount_cents,
          description: `Subscription to ${planName}`,
          quantity: 1,
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
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new AppError(
        `Failed to create subscription: ${error.response?.data?.message || error.message}`
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
