"use client";

import { cn } from "@workspace/ui/lib/utils";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Resolver } from "react-hook-form";
import {
  signIn,
  signUp,
  forgetPassword,
} from "@workspace/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@workspace/ui/components/logo";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { checkEmailExists } from "@/lib/email-check";
import { EmailStep } from "./email-step";
import { AuthStep } from "./auth-step";

export type AuthMode = "email" | "login" | "register";

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  email: z.string().email(),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export function UnifiedAuthForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [authMode, setAuthMode] = useState<AuthMode>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [, setEmailExists] = useState<boolean | null>(null);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  // Auto-hide reset password message after 2 seconds
  useEffect(() => {
    if (isResetPassword) {
      const timeout = setTimeout(() => {
        setIsResetPassword(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isResetPassword]);

  // Dynamic form schema based on auth mode
  const getFormSchema = () => {
    switch (authMode) {
      case "email":
        return emailSchema;
      case "login":
        return loginSchema;
      case "register":
        return registerSchema;
      default:
        return emailSchema;
    }
  };

  const form = useForm<AuthFormData>({
    resolver: zodResolver(getFormSchema()) as unknown as Resolver<AuthFormData>,
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const handleEmailSubmit = async (email: string) => {
    setIsLoading(true);
    try {
      const result = await checkEmailExists(email);
      setEmailExists(result.exists);

      if (result.exists) {
        setAuthMode("login");
        toast.success("Welcome back! Please enter your password.");
      } else {
        setAuthMode("register");
        toast.success("Let's create your account!");
      }
    } catch (error) {
      toast.error("Unable to verify email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = async (values: AuthFormData) => {
    setIsLoading(true);

    if (authMode === "login") {
      // Handle login
      const res = new Promise<{ email?: string }>((resolve, reject) => {
        signIn.email(
          {
            email: values.email,
            password: values.password,
            callbackURL: "/",
            rememberMe: true,
          },
          {
            onSuccess: (data) => {
              resolve({ email: data.data?.user.email });
            },
            onError: (error) => {
              console.log(error);
              reject({ message: error.error.message ?? "Unknown error" });
            },
          }
        );
      });

      toast.promise(res, {
        loading: "Logging in...",
        success: (data: { email?: string }) => {
          router.push(process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "");
          return `Welcome back, ${data.email}!`;
        },
        error: (error: { message: string }) => {
          setIsLoading(false);
          return `Failed to login: ${error.message}`;
        },
      });
    } else if (authMode === "register") {
      // Handle registration
      const res = new Promise<{ email?: string }>((resolve, reject) => {
        signUp.email(
          {
            email: values.email,
            password: values.password,
            name: values.name || values.email.split("@")[0] || "",
            callbackURL: "/",
          },
          {
            onSuccess: (data) => {
              resolve({ email: data.data?.user.email });
            },
            onError: (error) => {
              console.log(error);
              reject({ message: error.error.message ?? "Unknown error" });
            },
          }
        );
      });

      toast.promise(res, {
        loading: "Creating account...",
        success: (data: { email?: string }) => {
          router.push(process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "");
          return `Welcome to FOTNO, ${data.email}!`;
        },
        error: (error: { message: string }) => {
          setIsLoading(false);
          return `Failed to create account: ${error.message}`;
        },
      });
    }
  };

  const handleForgotPassword = async () => {
    const email = form.getValues("email");
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    try {
      const { data, error } = await forgetPassword({
        email,
        redirectTo: "/reset-password",
      });

      if (error) {
        toast.error(error.message ?? "Unknown error");
      } else if (data) {
        setIsResetPassword(true);
        toast.success("Password reset email sent! Check your inbox.");
      }
    } catch (error) {
      toast.error("Failed to send reset email. Please try again.");
    }
  };

  const handleBackToEmail = () => {
    setAuthMode("email");
    setEmailExists(null);
    form.reset({ email: form.getValues("email"), password: "", name: "" });
  };

  return (
    <div className={cn("min-h-screen flex", className)} {...props}>
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-20 xl:px-24 bg-white min-h-screen lg:min-h-0">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* FOTNO Logo */}
          <Logo />

          {authMode === "email" ? (
            <EmailStep
              form={form}
              isLoading={isLoading}
              onSubmit={handleEmailSubmit}
              plan={plan}
            />
          ) : (
            <AuthStep
              form={form}
              authMode={authMode}
              isLoading={isLoading}
              onSubmit={handleAuthSubmit}
              onForgotPassword={handleForgotPassword}
              onBackToEmail={handleBackToEmail}
              isResetPassword={isResetPassword}
            />
          )}

          {/* Terms */}
          <div className="mt-8 text-center text-sm text-gray-500">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gray-700">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>

      {/* Right side - Photography Illustration */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-700">
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
}
