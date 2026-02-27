import React from "react";
import { UseFormReturn } from "react-hook-form";
import { AuthFormData } from "./unified-auth-form";

type Props = {
  form: UseFormReturn<AuthFormData>;
};

const PasswordRequirements = ({ form }: Props) => {
  const password = form.watch("password") || "";

  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const hasError = Boolean(form.formState.errors.password);

  return (
    <div className="bg-muted border border-border rounded-lg p-4 space-y-3">
      <h3 className="text-sm font-medium text-foreground">
        Password Requirements
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {requirements.map(({ label, met }) => (
          <div key={label} className="flex items-center space-x-2 text-sm">
            <div
              className={`w-3 h-3 rounded-full flex items-center justify-center ${
                met
                  ? "bg-primary"
                  : hasError
                    ? "bg-destructive"
                    : "bg-border"
              }`}
            >
              {met && (
                <svg
                  className="w-2 h-2 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className={met ? "text-primary font-medium" : "text-muted-foreground"}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordRequirements;
