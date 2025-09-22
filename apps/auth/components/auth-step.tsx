"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { UseFormReturn } from "react-hook-form";
import { AuthFormData, AuthMode } from "./unified-auth-form";
import { ArrowLeft } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import PasswordRequirements from "./password-req";

interface AuthStepProps {
  form: UseFormReturn<AuthFormData>;
  authMode: AuthMode;
  isLoading: boolean;
  onSubmit: (values: AuthFormData) => void;
  onForgotPassword: () => void;
  onBackToEmail: () => void;
  isResetPassword: boolean;
}

export function AuthStep({
  form,
  authMode,
  isLoading,
  onSubmit,
  onForgotPassword,
  onBackToEmail,
  isResetPassword,
}: AuthStepProps) {
  const isLogin = authMode === "login";
  const isRegister = authMode === "register";

  const handleSubmit = (values: AuthFormData) => {
    onSubmit(values);
  };

  return (
    <>
      {/* Back Button */}
      <div className="mb-6">
        <Button
          type="button"
          variant="ghost"
          onClick={onBackToEmail}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 p-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
      </div>

      {/* Welcome Text */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isLogin ? "Welcome back!" : "Create your account"}
        </h1>
        <p className="text-gray-600">
          {isLogin
            ? `Enter your password to continue with ${form.getValues("email")}`
            : `Complete your registration to get started with ${form.getValues("email")}`}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Email Display (read-only) */}
          <div className="relative">
            <Input
              type="email"
              value={form.getValues("email")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              disabled
            />
          </div>

          {/* Name Input (only for registration) */}
          {isRegister && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
          )}

          {/* Password Requirements (only for registration) - Displayed prominently above password field */}
          {isRegister && <PasswordRequirements form={form} />}

          {/* Password Input */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder={
                      isLogin
                        ? "Enter your password"
                        : "Create a strong password"
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {/* Forgot Password Link (only for login) */}
          {isLogin && (
            <div className="text-center space-y-2">
              <p
                className={cn(
                  "text-sm text-rose-600 w-full mx-auto text-center transition-all duration-300 ease-in-out opacity-0 h-0 z-0 relative",
                  isResetPassword && "opacity-100 h-auto"
                )}
              >
                We sent a password reset email to your {form.getValues("email")}
              </p>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm  text-blue-600 hover:text-blue-500 font-medium hover:underline cursor-pointer z-10 relative"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? isLogin
                ? "Logging in..."
                : "Creating account..."
              : isLogin
                ? "Log in"
                : "Create account"}
          </Button>
        </form>
      </Form>
    </>
  );
}
