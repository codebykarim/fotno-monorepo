"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Icons } from "@workspace/ui/lib/icons";
import { cn } from "@workspace/ui/lib/utils";
import SoloCompany from "@/components/onboarding/SoloCompany";
import CompanyDetails from "@/components/onboarding/CompanyDetails";
import PhotographyPreferences from "@/components/onboarding/PhotographyPreferences";
import ContactPreferences from "@/components/onboarding/ContactPreferences";
import PlanSelection from "@/components/onboarding/PlanSelection";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FormFieldType,
  OnboardingFormSchema,
} from "@/lib/form-schemas/onboarding";
import { Form } from "@workspace/ui/components/form";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type StepContent = {
  badge: string;
  title: JSX.Element;
  description: string;
  image: string;
};

const stepContent: Record<string, StepContent> = {
  "User Type": {
    badge: "Choose Your Path",
    title: (
      <>
        Solo Photographer or
        <br />
        Team Player?
      </>
    ),
    description:
      "Tell us how you work best, and we'll customize your experience accordingly.",
    image: "/placeholder.svg",
  },
  "Company Details": {
    badge: "Team Setup",
    title: (
      <>
        Build Your
        <br />
        Team Profile
      </>
    ),
    description:
      "Set up your company profile to better manage your team and projects.",
    image: "/placeholder.svg",
  },
  "Photography Preferences": {
    badge: "Your Expertise",
    title: (
      <>
        Showcase Your
        <br />
        Photography Style
      </>
    ),
    description:
      "Help us understand your photography specialties and equipment level.",
    image: "/placeholder.svg",
  },
  "Contact Preferences": {
    badge: "Stay Connected",
    title: (
      <>
        Choose How to
        <br />
        Keep in Touch
      </>
    ),
    description:
      "Set up your preferred way of communication with clients and our platform.",
    image: "/placeholder.svg",
  },
  "Plan Selection": {
    badge: "Choose Your Plan",
    title: (
      <>
        Select Your
        <br />
        Perfect Plan
      </>
    ),
    description:
      "Choose a plan that matches your business needs and growth aspirations.",
    image: "/placeholder.svg",
  },
};

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const form = useForm<z.infer<typeof OnboardingFormSchema>>({
    resolver: zodResolver(OnboardingFormSchema),
    defaultValues: {
      userType: "solo",
      photographyTypes: [],
      plan: "PRO",
      companyName: "",
      companySize: undefined,
    },
  });

  const steps = [
    {
      title: "User Type",
      component: <SoloCompany form={form} />,
      fields: ["userType"] as FormFieldType[],
    },
    {
      title: "Company Details",
      component: <CompanyDetails form={form} />,
      fields: ["companyName", "companySize"] as FormFieldType[],
      condition: () => form.getValues("userType") === "team",
    },
    {
      title: "Photography Preferences",
      component: <PhotographyPreferences form={form} />,
      fields: ["photographyTypes", "equipmentLevel"] as FormFieldType[],
    },
    {
      title: "Contact Preferences",
      component: <ContactPreferences form={form} />,
      fields: ["preferredContactMethod", "phoneNumber"] as FormFieldType[],
    },
    {
      title: "Plan Selection",
      component: <PlanSelection form={form} />,
      fields: ["plan"] as FormFieldType[],
    },
  ];

  // Filter out steps based on conditions
  const activeSteps = steps.filter(
    (step) => !step.condition || step.condition()
  );

  const handleNext = async () => {
    const currentFields = activeSteps[currentStep]?.fields || [];

    try {
      // Create a partial schema for the current step
      const stepSchema = z.object(
        Object.fromEntries(
          currentFields.map((field) => {
            const fieldSchema = OnboardingFormSchema.shape[field];
            return [field, fieldSchema];
          })
        )
      );

      // Validate only the current step's data
      const stepData = Object.fromEntries(
        Object.entries(form.getValues()).filter(([key]) =>
          currentFields.includes(key as FormFieldType)
        )
      );

      // This will throw if validation fails
      await stepSchema.parseAsync(stepData);

      // If we get here, validation passed
      form.clearErrors();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Step validation failed:", error);
      // Trigger validation to show errors
      await form.trigger(currentFields);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      form.clearErrors();
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: z.infer<typeof OnboardingFormSchema>) => {
    try {
      // Validate the entire form before final submission
      await OnboardingFormSchema.parseAsync(data);
      console.log("Final submission:", data);
      // TODO: Send data to your API
      router.push("/");
    } catch (error) {
      console.error("Final validation failed:", error);
      // The form will display validation errors
    }
  };

  const renderFormContent = () => {
    const isLastStep = currentStep === activeSteps.length - 1;

    if (isLastStep) {
      return (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-1"
        >
          <div className="flex-1">
            {activeSteps[currentStep]?.component || null}
          </div>
          <div className="mt-auto pt-12 flex gap-4">
            <Button
              type="button"
              variant="default"
              className="rounded-full px-8 text-white border-gray-700 hover:bg-gray-800 hover:text-white"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="rounded-full px-8 bg-secondary hover:bg-yellow-600 text-white"
            >
              Complete
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className="flex flex-col flex-1">
        <div className="flex-1">
          {activeSteps[currentStep]?.component || null}
        </div>
        <div className="mt-auto pt-12 flex gap-4">
          <Button
            type="button"
            variant="default"
            className="rounded-full px-8 text-white border-gray-700 hover:bg-gray-800 hover:text-white"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={
              !activeSteps[currentStep]?.fields?.some((field) => {
                const value = form.getValues(field);
                if (field === "photographyTypes") {
                  return Array.isArray(value) && value.length > 0;
                }
                return !!value && !form.formState.errors[field];
              })
            }
            className="rounded-full px-8 bg-secondary hover:bg-yellow-600 text-white"
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const renderRightSection = useMemo(() => {
    const currentStepTitle = activeSteps[currentStep]?.title || "User Type";
    const currentStepContent = stepContent[currentStepTitle];

    // Hide right section for Plan Selection step
    if (!currentStepContent || currentStepTitle === "Plan Selection") {
      return null;
    }

    return (
      <div className="hidden md:w-1/2 bg-gradient-to-b from-gray-900 to-black md:block relative overflow-hidden">
        <div className="absolute inset-0 p-8 md:p-12 flex items-center justify-center">
          <div
            key={currentStepTitle}
            className="w-full max-w-md opacity-0 animate-in"
          >
            {/* Badge */}
            <div className="bg-white text-black text-sm font-medium px-4 py-1 rounded-full inline-block mb-4">
              {currentStepContent.badge}
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              {currentStepContent.title}
            </h2>

            <p className="text-gray-400 text-lg mb-8">
              {currentStepContent.description}
            </p>

            {/* Image section */}
            <div className="relative mt-8 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={currentStepContent.image}
                alt={currentStepTitle}
                width={500}
                height={300}
                className="w-full h-auto"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [currentStep, activeSteps]);

  return (
    <main className="min-h-screen bg-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-background rounded-3xl overflow-hidden shadow-2xl">
        <div
          className={cn(
            "flex flex-col md:flex-row h-[748px] max-h-[900px] ",
            activeSteps[currentStep]?.title === "Plan Selection"
              ? "md:w-full md:mx-auto"
              : ""
          )}
        >
          {/* Left Section */}
          <div
            className={cn(
              "w-full p-8 flex flex-col h-full overflow-y-auto",
              activeSteps[currentStep]?.title === "Plan Selection"
                ? "md:w-full"
                : "md:w-1/2"
            )}
          >
            {/* Header */}
            <div className="mb-8 flex-shrink-0">
              <Link
                href={`${process.env.NEXT_PUBLIC_LANDING_URL}`}
                aria-label="Home"
              >
                <div className="flex items-center justify-start gap-2">
                  <Icons.logo className="h-8 w-auto text-secondary" />
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-secondary to-foreground bg-clip-text text-transparent">
                    FOTNO
                  </h1>
                </div>
              </Link>
            </div>

            {/* Progress indicator */}
            <div className="mb-6 flex-shrink-0">
              <div className="flex items-center gap-2">
                {activeSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full flex-1 ${
                      index <= currentStep ? "bg-secondary" : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Step {currentStep + 1} of {activeSteps.length}
              </p>
            </div>

            {/* Form */}
            <Form {...form}>{renderFormContent()}</Form>
          </div>
          {/* Right Section */}
          {renderRightSection}
        </div>
      </div>
    </main>
  );
}
