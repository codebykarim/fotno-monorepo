import React from "react";
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormSchema } from "@/lib/onboarding-schema";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";

type Props = {
  form: UseFormReturn<z.infer<typeof OnboardingFormSchema>>;
};

const photographyTypes = [
  { id: "portrait", label: "Portrait" },
  { id: "wedding", label: "Wedding" },
  { id: "event", label: "Event" },
  { id: "commercial", label: "Commercial" },
  { id: "landscape", label: "Landscape" },
  { id: "product", label: "Product" },
];

const PhotographyPreferences = ({ form }: Props) => {
  return (
    <div className="flex-grow flex flex-col justify-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Your Photography
        <br />
        Expertise
      </h1>
      <p className="text-gray-400 mb-8">
        Tell us about your photography specialties and experience level.
      </p>

      <div className="space-y-8">
        <FormField
          control={form.control}
          name="photographyTypes"
          render={() => (
            <FormItem>
              <FormLabel className="text-white">Photography Types</FormLabel>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {photographyTypes.map((type) => (
                  <FormField
                    key={type.id}
                    control={form.control}
                    name="photographyTypes"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={type.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(type.id)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                return checked
                                  ? field.onChange([...current, type.id])
                                  : field.onChange(
                                      current.filter(
                                        (value) => value !== type.id
                                      )
                                    );
                              }}
                              className="border-gray-700"
                            />
                          </FormControl>
                          <FormLabel className="text-white font-normal">
                            {type.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="equipmentLevel"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-white">Equipment Level</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        value="BEGINNER"
                        className="border-gray-700"
                      />
                    </FormControl>
                    <FormLabel className="text-white font-normal">
                      Beginner - Starting out with basic equipment
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        value="INTERMEDIATE"
                        className="border-gray-700"
                      />
                    </FormControl>
                    <FormLabel className="text-white font-normal">
                      Intermediate - Good quality equipment for most situations
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        value="PROFESSIONAL"
                        className="border-gray-700"
                      />
                    </FormControl>
                    <FormLabel className="text-white font-normal">
                      Professional - High-end equipment for all scenarios
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PhotographyPreferences;
