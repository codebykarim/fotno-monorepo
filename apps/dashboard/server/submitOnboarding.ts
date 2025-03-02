import { authClient } from "@/lib/auth-client";
import {
  OnboardingFormSchema,
  OnboardingSchemaType,
} from "@/lib/form-schemas/onboarding";
import { betterFetch } from "@better-fetch/fetch";

export const submitOnboarding = async (
  values: OnboardingSchemaType
): Promise<{
  checkoutUrl: string;
}> => {
  try {
    const session = await authClient.getSession();

    const validatedFields = OnboardingFormSchema.safeParse(values);

    if (!validatedFields.success) {
      throw new Error("Invalid fields");
    }

    if (!session) throw new Error("Token is required");

    const {
      equipmentLevel,
      photographyTypes,
      plan,
      userType,
      preferredContactMethod,
      companyName,
      companySize,
      phoneNumber,
      first_name,
      last_name,
      country,
      state,
      street,
    } = validatedFields.data;

    const { data, error } = await betterFetch<{ checkoutUrl: string }>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-subscription`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userType,
          companyName,
          companySize,
          photographyType: photographyTypes,
          photographyLevel: equipmentLevel,
          contactMethod: preferredContactMethod,
          planName: plan,
          billing_data: {
            first_name,
            last_name,
            phone_number: phoneNumber,
            country,
            state,
            street,
          },
        }),
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("No data returned from server");
    }

    return data;
  } catch (error: any) {
    console.error("Error during onboarding submission:", error.message);
    throw error;
  }
};
