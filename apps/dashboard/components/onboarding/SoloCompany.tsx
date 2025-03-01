import React from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import {
  FormFieldType,
  OnboardingFormSchema,
} from "@/lib/form-schemas/onboarding";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { cn } from "@workspace/ui/lib/utils";

type Props = {
  form: UseFormReturn<z.infer<typeof OnboardingFormSchema>>;
};

const CustomRadioItem = React.forwardRef<
  HTMLDivElement,
  {
    value: string;
    children: React.ReactNode;
    isSelected?: boolean;
    field: ControllerRenderProps<
      {
        userType: "solo" | "team";
        photographyTypes: string[];
        equipmentLevel: "beginner" | "intermediate" | "professional";
        preferredContactMethod: "email" | "phone" | "both";
        plan: "BEGGINER" | "PRO" | "STUDIO";
        companyName?: string | undefined;
        companySize?:
          | "1-10"
          | "11-50"
          | "51-200"
          | "201-500"
          | "500+"
          | undefined;
        phoneNumber?: string | undefined;
      },
      "userType"
    >;
  }
>((props, ref) => {
  const { value, children, isSelected, field } = props;

  return (
    <FormItem onClick={() => field.onChange(value)}>
      <FormControl>
        <div
          ref={ref}
          className={cn(
            "rounded-xl p-4 relative transition-colors cursor-pointer",
            isSelected ? "bg-secondary" : "bg-gray-900 hover:bg-gray-800"
          )}
        >
          <RadioGroupItem value={value} className="sr-only" />
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">{children}</span>
          </div>
          <div
            className={cn(
              "absolute top-4 right-4 w-5 h-5 rounded-full",
              isSelected
                ? "bg-white flex items-center justify-center"
                : "border border-white"
            )}
          >
            {isSelected && (
              <div className="w-2.5 h-2.5 bg-secondary rounded-full" />
            )}
          </div>
        </div>
      </FormControl>
    </FormItem>
  );
});

CustomRadioItem.displayName = "CustomRadioItem";

const SoloCompany = ({ form }: Props) => {
  const watchUserType = form.watch("userType");

  return (
    <div className="flex-grow flex flex-col justify-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Tell us more about
        <br />
        your work
      </h1>
      <p className="text-gray-400 mb-8">
        Let&apos;s tailor the system to your needs.
      </p>

      <FormField
        control={form.control}
        name="userType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <CustomRadioItem
                  value="solo"
                  isSelected={watchUserType === "solo"}
                  field={field}
                >
                  I&apos;m a solo Photographer
                </CustomRadioItem>
                <CustomRadioItem
                  value="team"
                  isSelected={watchUserType === "team"}
                  field={field}
                >
                  I&apos;m part of a team / company
                </CustomRadioItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SoloCompany;
