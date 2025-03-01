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

const CompanyDetails = ({ form }: Props) => {
  return (
    <div className="flex-grow flex flex-col justify-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Tell us about your
        <br />
        company
      </h1>
      <p className="text-gray-400 mb-8">
        This information helps us customize your experience.
      </p>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Company Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your company name"
                  className="bg-gray-900 border-gray-700 text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companySize"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Company Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="1-10" className="text-white">
                    1-10 employees
                  </SelectItem>
                  <SelectItem value="11-50" className="text-white">
                    11-50 employees
                  </SelectItem>
                  <SelectItem value="51-200" className="text-white">
                    51-200 employees
                  </SelectItem>
                  <SelectItem value="201-500" className="text-white">
                    201-500 employees
                  </SelectItem>
                  <SelectItem value="500+" className="text-white">
                    500+ employees
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CompanyDetails;
