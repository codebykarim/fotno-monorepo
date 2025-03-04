import React from "react";
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormSchema } from "@/lib/form-schemas/onboarding";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

type Props = {
  form: UseFormReturn<z.infer<typeof OnboardingFormSchema>>;
};

const countries = [{ value: "EG", label: "Egypt" }];

const states = {
  EG: [
    { value: "CAI", label: "Cairo" },
    { value: "GIZ", label: "Giza" },
    { value: "ALX", label: "Alexandria" },
    { value: "ASW", label: "Aswan" },
    { value: "AST", label: "Asyut" },
    { value: "BHR", label: "Beheira" },
    { value: "BNS", label: "Beni Suef" },
    { value: "DAK", label: "Dakahlia" },
    { value: "DMT", label: "Damietta" },
    { value: "FYM", label: "Faiyum" },
    { value: "GBY", label: "Al Gharbia" },
    { value: "ISM", label: "Ismailia" },
    { value: "KFS", label: "Kafr El Sheikh" },
    { value: "LUX", label: "Luxor" },
    { value: "MTR", label: "Matrouh" },
    { value: "MIN", label: "Minya" },
    { value: "MNF", label: "Monufia" },
    { value: "NSI", label: "North Sinai" },
    { value: "PTS", label: "Port Said" },
    { value: "QAL", label: "Qalyubia" },
    { value: "QEN", label: "Qena" },
    { value: "RSE", label: "Red Sea" },
    { value: "SHR", label: "Al Sharqia" },
    { value: "SHG", label: "Sohag" },
    { value: "SSI", label: "South Sinai" },
    { value: "SUZ", label: "Suez" },
    { value: "WAD", label: "New Valley" },
  ],
};

const BillingInformation = ({ form }: Props) => {
  const watchCountry = form.watch("country");

  return (
    <div className="flex-grow flex flex-col justify-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Billing Information
      </h1>
      <p className="text-gray-400 mb-8">
        Please provide your billing details for invoice purposes.
      </p>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your first name"
                    className="bg-secondary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your last name"
                    className="bg-secondary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Street Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your street address"
                  className="bg-secondary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Country</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-secondary">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {countries.map((country) => (
                      <SelectItem
                        key={country.value}
                        value={country.value}
                        className="text-white"
                      >
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">State/Province</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={
                    !watchCountry ||
                    !states[watchCountry as keyof typeof states]
                  }
                >
                  <FormControl>
                    <SelectTrigger className="bg-secondary">
                      <SelectValue placeholder="Select your state/province" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {watchCountry &&
                      states[watchCountry as keyof typeof states]?.map(
                        (state) => (
                          <SelectItem
                            key={state.value}
                            value={state.value}
                            className="text-white"
                          >
                            {state.label}
                          </SelectItem>
                        )
                      )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default BillingInformation;
