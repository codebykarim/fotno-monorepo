import { cn } from "@workspace/ui/lib/utils";
import {
  FormField,
  FormItem,
  FormControl,
} from "@workspace/ui/components/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import AnimatedList from "@workspace/ui/components/animated-list";
import { CheckIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { OnboardingFormSchema } from "@/lib/form-schemas/onboarding";

interface PlanProps {
  form: UseFormReturn<z.infer<typeof OnboardingFormSchema>>;
}

const plans = [
  {
    id: "BEGGINER",
    name: "Beginner",
    price: "EGP 500",
    description: "Good for anyone who is self-employed and getting started.",
    features: [
      "Send 10 quotes and invoices",
      "Connect up to 2 bank accounts",
      "Track up to 15 expenses per month",
      "Manual payroll support",
      "Export up to 3 reports",
    ],
    highlight: false,
  },
  {
    id: "PRO",
    name: "Professional",
    price: "EGP 1100",
    description: "Perfect for small / medium sized businesses.",
    features: [
      "Send 25 quotes and invoices",
      "Connect up to 5 bank accounts",
      "Track up to 50 expenses per month",
      "Automated payroll support",
      "Export up to 12 reports",
      "Bulk reconcile transactions",
      "Track in multiple currencies",
    ],
    highlight: true,
  },
  {
    id: "STUDIO",
    name: "Studio",
    price: "EGP 1500",
    description: "Perfect for small / medium sized businesses.",
    features: [
      "Send 25 quotes and invoices",
      "Connect up to 5 bank accounts",
      "Track up to 50 expenses per month",
      "Automated payroll support",
      "Export up to 12 reports",
      "Bulk reconcile transactions",
      "Track in multiple currencies",
    ],
    highlight: false,
  },
];

export default function PlanSelection({ form }: PlanProps) {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
        <p className="mt-2 text-sm text-gray-400">
          Select the plan that best fits your needs. You can always change this
          later.
        </p>
      </div>

      <FormField
        control={form.control}
        name="plan"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2"
              >
                {plans.map((item) => (
                  <label
                    key={item.id}
                    className={cn(
                      "relative flex cursor-pointer rounded-xl border p-6 transition-all duration-200 focus:outline-none w-full",
                      field.value === item.id
                        ? "border-secondary bg-secondary/10 border-2"
                        : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50 opacity-75",
                      item.highlight &&
                        "scale-105 bg-gradient-to-br from-secondary/90 to-accent/90 shadow-lg",
                      field.value === item.id && !item.highlight
                        ? "border-accent bg-accent/10 border-2"
                        : ""
                    )}
                  >
                    {item.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                        <span className="inline-flex items-center rounded-full bg-secondary px-4 py-1 text-xs font-medium text-white shadow-lg">
                          Recommended
                        </span>
                      </div>
                    )}
                    <RadioGroupItem
                      value={item.id}
                      id={item.id}
                      className="sr-only"
                    />
                    <div className="flex flex-1">
                      <div className="flex flex-col w-full">
                        <p
                          className={cn(
                            "text-2xl font-bold",
                            item.highlight ? "text-white" : "text-gray-100"
                          )}
                        >
                          {item.price}
                        </p>
                        <div>
                          <h3
                            className={cn(
                              "text-lg font-semibold",
                              item.highlight ? "text-white" : "text-gray-100"
                            )}
                          >
                            {item.name}
                          </h3>
                          <p
                            className={cn(
                              "mt-0 text-sm",
                              item.highlight ? "text-gray-200" : "text-gray-400"
                            )}
                          >
                            {item.description}
                          </p>
                        </div>
                        <div className="mt-6 flex flex-col gap-y-2">
                          {item.features.map((feature) => (
                            <div key={feature} className="flex items-center">
                              <CheckIcon
                                className={cn(
                                  item.highlight
                                    ? "text-secondary"
                                    : "text-accent",
                                  "size-4"
                                )}
                              />
                              <span
                                className={cn(
                                  "ml-3 text-sm",
                                  item.highlight
                                    ? "text-gray-200"
                                    : "text-gray-400"
                                )}
                              >
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
