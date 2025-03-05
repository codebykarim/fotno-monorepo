import { z } from "zod";

export const OnboardingFormSchema = z.object({
  // Step 1: User Type (Required)
  userType: z.enum(["SOLO", "TEAM"], {
    required_error: "You need to select a user type.",
  }),

  // Step 2: Company Details (Required only if userType is "team")
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .optional(),
  companySize: z
    .enum(["1-10", "11-50", "51-200", "201-500", "500+"])
    .optional(),
  // Step 3: Photography Preferences (Required)
  photographyTypes: z
    .array(z.string())
    .min(1, "Select at least one type of photography")
    .optional(),
  equipmentLevel: z
    .enum(["BEGINNER", "INTERMEDIATE", "PROFESSIONAL"], {
      required_error: "Please select your equipment level",
    })
    .optional(),

  // Step 4: Contact Preferences (Required)
  preferredContactMethod: z
    .enum(["EMAIL", "PHONE", "BOTH"], {
      required_error: "Please select your preferred contact method",
    })
    .optional(),
  phoneNumber: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val) return true;
      return val.length >= 10;
    }, "Phone number must be at least 10 digits")
    .optional(),
  plan: z.enum(["BEGGINER", "PRO", "STUDIO"]).optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  street: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export type FormFieldType = keyof z.infer<typeof OnboardingFormSchema>;
export type OnboardingSchemaType = z.infer<typeof OnboardingFormSchema>;
