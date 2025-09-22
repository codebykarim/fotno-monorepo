import React from "react";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<any>;
};

const PasswordRequirements = ({ form }: Props) => {
  const password = form.watch("password") || "";
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
      <h3 className="text-sm font-medium text-gray-900">
        Password Requirements
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="flex items-center space-x-2 text-sm">
          <div
            className={`w-3 h-3 rounded-full flex items-center justify-center ${
              password?.length >= 8
                ? "bg-green-500"
                : form.formState.errors.password
                  ? "bg-red-500"
                  : "bg-gray-300"
            }`}
          >
            {password?.length >= 8 && (
              <svg
                className="w-2 h-2 text-white"
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
          <span
            className={
              password?.length >= 8
                ? "text-green-700 font-medium"
                : "text-gray-600"
            }
          >
            At least 8 characters
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div
            className={`w-3 h-3 rounded-full flex items-center justify-center ${
              /[A-Z]/.test(password || "")
                ? "bg-green-500"
                : form.formState.errors.password
                  ? "bg-red-500"
                  : "bg-gray-300"
            }`}
          >
            {/[A-Z]/.test(password || "") && (
              <svg
                className="w-2 h-2 text-white"
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
          <span
            className={
              /[A-Z]/.test(password || "")
                ? "text-green-700 font-medium"
                : "text-gray-600"
            }
          >
            One uppercase letter
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div
            className={`w-3 h-3 rounded-full flex items-center justify-center ${
              /[0-9]/.test(password || "")
                ? "bg-green-500"
                : form.formState.errors.password
                  ? "bg-red-500"
                  : "bg-gray-300"
            }`}
          >
            {/[0-9]/.test(password || "") && (
              <svg
                className="w-2 h-2 text-white"
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
          <span
            className={
              /[0-9]/.test(password || "")
                ? "text-green-700 font-medium"
                : "text-gray-600"
            }
          >
            One number
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div
            className={`w-3 h-3 rounded-full flex items-center justify-center ${
              /[^A-Za-z0-9]/.test(password || "")
                ? "bg-green-500"
                : form.formState.errors.password
                  ? "bg-red-500"
                  : "bg-gray-300"
            }`}
          >
            {/[^A-Za-z0-9]/.test(password || "") && (
              <svg
                className="w-2 h-2 text-white"
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
          <span
            className={
              /[^A-Za-z0-9]/.test(password || "")
                ? "text-green-700 font-medium"
                : "text-gray-600"
            }
          >
            One special character
          </span>
        </div>
      </div>
    </div>
  );
};

export default PasswordRequirements;
