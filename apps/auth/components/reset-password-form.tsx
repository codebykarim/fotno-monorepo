"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { resetPassword } from "@workspace/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import PasswordRequirements from "./password-req";
type Props = {
  token: string | string[];
  email: string | string[] | undefined;
};

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export const ResetPasswordForm = ({ token, email }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const safeToken = useMemo(
    () => (Array.isArray(token) ? token[0] : token),
    [token]
  );
  const safeEmail = useMemo(
    () => (Array.isArray(email) ? email[0] : email),
    [email]
  );

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormData) => {
    if (!safeToken) {
      toast.error("Reset token is missing");
      return;
    }

    setIsLoading(true);
    const res = new Promise<{ success?: string }>((resolve, reject) => {
      resetPassword(
        {
          newPassword: values.password,
          token: safeToken,
        },
        {
          onSuccess: (data) => {
            resolve({ success: data.data });
          },
          onError: (error) => {
            reject({ message: error.error.message ?? "Unknown error" });
          },
        }
      );
    });

    toast.promise(res, {
      loading: "Resetting password...",
      success: () => {
        router.push(`/account?email=${safeEmail ?? ""}`);
        return `Password reset successful`;
      },
      error: (error: { message: string }) => {
        setIsLoading(false);
        return `Failed to reset password: ${error.message} Please try again.`;
      },
    });
  };

  return (
    <div className={cn("min-h-screen flex text-foreground")}>
      {/* Left side - Form */}
      <div className="min-h-screen flex-1 bg-card/90 px-4 py-8 sm:px-6 lg:min-h-0 lg:px-20 xl:px-24 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* FOTNO Logo */}
          <div className={"relative w-40 h-10 left-1/2 -translate-x-1/2 mb-8"}>
            <img
              src="/logo.png"
              alt="FOTNO Logo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground">
              Reset your password
            </h1>
            <p className="text-muted-foreground">
              Please enter your new password below to complete the reset
              process.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Password Input with Validation */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    {/* Password Strength Indicator */}
                    <PasswordRequirements form={form} />
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter new password"
                        className="w-full rounded-lg border-border px-4 py-3 focus-visible:ring-ring"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-destructive" />
                  </FormItem>
                )}
              />

              {/* Confirm Password Input */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full rounded-lg border-border px-4 py-3 focus-visible:ring-ring"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-destructive" />
                  </FormItem>
                )}
              />

              {/* Reset Password Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="auth-cta w-full text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>

              {/* Back to account link */}
              <div className="text-center">
                <span className="text-muted-foreground">Remember your password? </span>
                <Link
                  href="/account"
                  className="cursor-pointer font-medium text-foreground hover:underline"
                >
                  Back to login
                </Link>
              </div>
            </form>
          </Form>

          {/* Terms */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-foreground">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>

      {/* Right side - Photography Illustration */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600">
          {/* Photography Illustration Container */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Background decorative elements - Camera-themed */}
            <div className="absolute top-20 left-20 w-8 h-8 bg-white rounded-lg opacity-20 transform rotate-12">
              <div className="w-2 h-2 bg-blue-300 rounded-full absolute top-1 left-1"></div>
            </div>
            <div className="absolute top-40 right-32 w-6 h-6 bg-yellow-300 rounded-full opacity-60"></div>
            <div className="absolute bottom-32 left-16 w-4 h-4 bg-white rounded-sm opacity-30 transform rotate-45"></div>
            <div className="absolute bottom-20 right-20 w-3 h-3 bg-purple-300 rounded-full opacity-80"></div>

            {/* Floating camera elements */}
            <div className="absolute top-32 right-16 w-12 h-8 bg-white rounded-lg opacity-25 transform -rotate-12">
              <div className="w-3 h-3 bg-blue-400 rounded-full absolute top-1 right-1"></div>
            </div>
            <div className="absolute bottom-40 left-24 w-10 h-6 bg-white rounded-md opacity-20 transform rotate-6">
              <div className="w-2 h-2 bg-purple-400 rounded-full absolute top-1 left-1"></div>
            </div>

            {/* Main Photography Scene */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                {/* Large Camera Body */}
                <div className="w-80 h-56 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl relative shadow-2xl">
                  {/* Camera Top */}
                  <div className="absolute -top-4 left-8 right-8 h-8 bg-gradient-to-r from-gray-700 to-gray-800 rounded-t-lg"></div>

                  {/* Lens */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-gray-600 to-black rounded-full shadow-inner">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-blue-900 to-purple-900 rounded-full">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-blue-800 to-purple-800 rounded-full">
                        <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full opacity-60"></div>
                      </div>
                    </div>
                  </div>

                  {/* Camera Details */}
                  <div className="absolute top-4 left-4 w-6 h-6 bg-red-500 rounded-full shadow-lg"></div>
                  <div className="absolute top-4 right-4 w-4 h-4 bg-green-400 rounded-sm"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-2 bg-gray-600 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-12 h-3 bg-gray-600 rounded-lg"></div>

                  {/* Flash */}
                  <div className="absolute -top-2 left-1/4 w-8 h-4 bg-white rounded-md shadow-lg">
                    <div className="absolute inset-1 bg-gradient-to-r from-yellow-200 to-yellow-100 rounded-sm"></div>
                  </div>
                </div>

                {/* Floating Photos */}
                <div className="absolute -top-20 -left-16 w-16 h-12 bg-white rounded-lg shadow-lg transform rotate-12 border-2 border-gray-200">
                  <div className="absolute inset-2 bg-gradient-to-br from-blue-200 to-purple-200 rounded-sm"></div>
                  <div className="absolute bottom-1 left-1 right-1 h-2 bg-gray-100 rounded-sm"></div>
                </div>

                <div className="absolute -top-16 -right-20 w-14 h-10 bg-white rounded-lg shadow-lg transform -rotate-6 border-2 border-gray-200">
                  <div className="absolute inset-2 bg-gradient-to-br from-green-200 to-blue-200 rounded-sm"></div>
                  <div className="absolute bottom-1 left-1 right-1 h-2 bg-gray-100 rounded-sm"></div>
                </div>

                <div className="absolute -bottom-20 -left-20 w-18 h-14 bg-white rounded-lg shadow-lg transform rotate-6 border-2 border-gray-200">
                  <div className="absolute inset-2 bg-gradient-to-br from-purple-200 to-pink-200 rounded-sm"></div>
                  <div className="absolute bottom-1 left-1 right-1 h-2 bg-gray-100 rounded-sm"></div>
                </div>

                <div className="absolute -bottom-16 -right-16 w-16 h-12 bg-white rounded-lg shadow-lg transform -rotate-12 border-2 border-gray-200">
                  <div className="absolute inset-2 bg-gradient-to-br from-orange-200 to-red-200 rounded-sm"></div>
                  <div className="absolute bottom-1 left-1 right-1 h-2 bg-gray-100 rounded-sm"></div>
                </div>

                {/* Light Rays */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-1 h-32 bg-gradient-to-t from-transparent via-yellow-300 to-transparent opacity-40"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45 w-1 h-32 bg-gradient-to-t from-transparent via-yellow-300 to-transparent opacity-40"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-40"></div>
              </div>
            </div>

            {/* Additional photography elements */}
            <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-gradient-to-br from-white to-gray-200 rounded-full opacity-30 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
            </div>
            <div className="absolute bottom-1/4 right-1/6 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-40 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
