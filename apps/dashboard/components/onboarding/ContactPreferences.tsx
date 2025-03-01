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
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";

type Props = {
  form: UseFormReturn<z.infer<typeof OnboardingFormSchema>>;
};

const ContactPreferences = ({ form }: Props) => {
  const watchPreferredContactMethod = form.watch("preferredContactMethod");

  return (
    <div className="flex-grow flex flex-col justify-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        How should we
        <br />
        contact you?
      </h1>
      <p className="text-gray-400 mb-8">
        Choose your preferred method of communication.
      </p>

      <div className="space-y-8">
        <FormField
          control={form.control}
          name="preferredContactMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-white">Contact Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        value="email"
                        className="border-gray-700"
                      />
                    </FormControl>
                    <FormLabel className="text-white font-normal">
                      Email Only
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        value="phone"
                        className="border-gray-700"
                      />
                    </FormControl>
                    <FormLabel className="text-white font-normal">
                      Phone Only
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        value="both"
                        className="border-gray-700"
                      />
                    </FormControl>
                    <FormLabel className="text-white font-normal">
                      Both Email and Phone
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(watchPreferredContactMethod === "phone" ||
          watchPreferredContactMethod === "both") && (
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your phone number"
                    className="bg-gray-900 border-gray-700 text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default ContactPreferences;
