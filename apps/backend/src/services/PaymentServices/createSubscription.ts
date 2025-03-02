/* 
Example request body:
{
  "amount": 50000,
  "currency": "EGP",
  "payment_methods": [
    158
  ],
  "subscription_plan_id": 127,
  "subscription_start_date": "2024-09-25",
  "items": [
    {
      "name": "Item name 1",
      "amount": 50000,
      "description": "Watch",
      "quantity": 1
    }
  ],
  "billing_data": {
    "apartment": "6",
    "first_name": "Ammar",
    "last_name": "Sadek",
    "street": "938, Al-Jadeed Bldg",
    "building": "939",
    "phone_number": "+96824480228",
    "country": "xxx",
    "email": "AmmarSadek@gmail.com",
    "floor": "1",
    "state": "Alkhuwair"
  },
  "customer": {
    "first_name": "Ammar",
    "last_name": "Sadek",
    "email": "AmmarSadek@gmail.com",
    "extras": {
      "re": "22"
    }
  },
  "extras": {
    "ee": 22
  }
}
*/

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

interface Customer {
  first_name: string;
  last_name: string;
  email: string;
  extras?: Record<string, any>;
}

interface Item {
  name: string;
  amount: number;
  description: string;
  quantity: number;
}

interface PaymobPlan {
  id: number;
  name: string;
  is_active: boolean;
  [key: string]: any;
}

interface CreateSubscriptionRequest {
  amount: number;
  currency: string;
  payment_methods: number[];
  planName: string;
  subscription_start_date?: string;
  items: Item[];
  billing_data: BillingData;
  customer: Customer;
  extras?: Record<string, any>;
}

interface CreateSubscriptionResponse {
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
    };

    const response = await axios.post(
      "https://accept.paymob.com/v1/intention/",
      finalData,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYMOB_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
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
