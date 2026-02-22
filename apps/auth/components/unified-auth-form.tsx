"use client";

import { type ComponentProps, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Github,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  forgetPassword,
  sendVerificationOTP,
  signIn,
  signUp,
} from "@workspace/lib/auth/auth-client";

import PasswordRequirements from "./password-req";
import { checkEmailExists } from "@/lib/email-check";

export type AuthMode = "email" | "login" | "register" | "otp";

export interface AuthFormData {
  email: string;
  password: string;
  name: string;
  otp: string;
}

const emailSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
});

const otpSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code"),
});

const OTP_RESEND_SECONDS = 60;

export function UnifiedAuthForm({
  className,
  resetEmail,
  ...props
}: ComponentProps<"div"> & {
  resetEmail?: string | string[] | undefined;
}) {
  const [authMode, setAuthMode] = useState<AuthMode>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  const form = useForm<AuthFormData>({
    defaultValues: {
      email: typeof resetEmail === "string" ? resetEmail : "",
      password: "",
      name: "",
      otp: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (typeof resetEmail === "string" && resetEmail.length > 0) {
      form.setValue("email", resetEmail);
      setAuthMode("login");
    }
  }, [form, resetEmail]);

  useEffect(() => {
    if (!isResetPassword) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsResetPassword(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isResetPassword]);

  useEffect(() => {
    if (otpCountdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setOtpCountdown((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [otpCountdown]);

  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || "/";
  const getErrorMessage = (error: unknown, fallback: string): string => {
    if (
      typeof error === "object" &&
      error !== null &&
      "error" in error &&
      typeof (error as { error?: { message?: string } }).error?.message ===
        "string"
    ) {
      return (error as { error: { message: string } }).error.message;
    }

    return fallback;
  };

  const redirectToDashboard = () => {
    if (dashboardUrl.startsWith("http")) {
      window.location.href = dashboardUrl;
      return;
    }

    router.push(dashboardUrl);
  };

  const setFieldErrors = (
    result: z.SafeParseError<unknown>,
    fields: Array<keyof AuthFormData>,
  ) => {
    for (const field of fields) {
      form.clearErrors(field);
    }

    for (const issue of result.error.issues) {
      const path = issue.path[0];
      if (typeof path === "string") {
        form.setError(path as keyof AuthFormData, {
          type: "manual",
          message: issue.message,
        });
      }
    }
  };

  const handleEmailSubmit = async (emailInput: string) => {
    const parsed = emailSchema.safeParse({ email: emailInput.toLowerCase() });
    if (!parsed.success) {
      setFieldErrors(parsed, ["email"]);
      return;
    }

    setIsLoading(true);

    try {
      const result = await checkEmailExists(parsed.data.email);
      form.setValue("email", parsed.data.email);

      if (result.exists) {
        setAuthMode("login");
      } else {
        setAuthMode("register");
      }
    } catch {
      toast.error("Unable to verify this email right now.");
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = async () => {
    const email = form.getValues("email").toLowerCase();
    const parsed = emailSchema.safeParse({ email });
    if (!parsed.success) {
      setFieldErrors(parsed, ["email"]);
      return;
    }

    setIsSendingOtp(true);

    try {
      const { error } = await sendVerificationOTP({
        email: parsed.data.email,
        type: "sign-in",
      });

      if (error) {
        toast.error(error.message || "Failed to send verification code");
        return;
      }

      setAuthMode("otp");
      form.setValue("otp", "");
      setOtpCountdown(OTP_RESEND_SECONDS);
      toast.success("Verification code sent to your email");
    } catch {
      toast.error("Unable to send verification code");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleAuthSubmit = async (values: AuthFormData) => {
    const payload = {
      email: values.email.toLowerCase(),
      password: values.password,
      name: values.name,
      otp: values.otp,
    };

    if (authMode === "login") {
      const parsed = loginSchema.safeParse(payload);
      if (!parsed.success) {
        setFieldErrors(parsed, ["email", "password"]);
        return;
      }

      setIsLoading(true);
      const result = new Promise<{ email?: string }>((resolve, reject) => {
        signIn.email(
          {
            email: parsed.data.email,
            password: parsed.data.password,
            callbackURL: "/",
            rememberMe: true,
          },
          {
            onSuccess: (data: any) => resolve({ email: data.data?.user.email }),
            onError: (error: unknown) =>
              reject({ message: getErrorMessage(error, "Failed to log in") }),
          },
        );
      });

      toast.promise(result, {
        loading: "Logging you in...",
        success: () => {
          redirectToDashboard();
          return "Welcome back";
        },
        error: (error: { message: string }) => {
          setIsLoading(false);
          return error.message;
        },
      });

      return;
    }

    if (authMode === "register") {
      const parsed = registerSchema.safeParse(payload);
      if (!parsed.success) {
        setFieldErrors(parsed, ["email", "name", "password"]);
        return;
      }

      setIsLoading(true);
      const result = new Promise<{ email?: string }>((resolve, reject) => {
        signUp.email(
          {
            email: parsed.data.email,
            password: parsed.data.password,
            name: parsed.data.name,
            subscribed: false,
            finishOnboarding: false,
            callbackURL: "/",
          },
          {
            onSuccess: (data: any) => resolve({ email: data.data?.user.email }),
            onError: (error: unknown) =>
              reject({
                message: getErrorMessage(error, "Failed to create account"),
              }),
          },
        );
      });

      toast.promise(result, {
        loading: "Creating your account...",
        success: () => {
          redirectToDashboard();
          return "Your account is ready";
        },
        error: (error: { message: string }) => {
          setIsLoading(false);
          return error.message;
        },
      });

      return;
    }

    if (authMode === "otp") {
      const parsed = otpSchema.safeParse(payload);
      if (!parsed.success) {
        setFieldErrors(parsed, ["email", "otp"]);
        return;
      }

      setIsLoading(true);
      const result = new Promise<void>((resolve, reject) => {
        signIn.emailOtp(
          {
            email: parsed.data.email,
            otp: parsed.data.otp,
          },
          {
            onSuccess: () => resolve(),
            onError: (error: unknown) =>
              reject({
                message: getErrorMessage(error, "Invalid verification code"),
              }),
          },
        );
      });

      toast.promise(result, {
        loading: "Verifying your code...",
        success: () => {
          redirectToDashboard();
          return "Signed in successfully";
        },
        error: (error: { message: string }) => {
          setIsLoading(false);
          return error.message;
        },
      });
    }
  };

  const handleForgotPassword = async () => {
    const email = form.getValues("email").toLowerCase();
    const parsed = emailSchema.safeParse({ email });

    if (!parsed.success) {
      setFieldErrors(parsed, ["email"]);
      return;
    }

    const { error } = await forgetPassword({
      email: parsed.data.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast.error(error.message || "Failed to send reset email");
      return;
    }

    setIsResetPassword(true);
    toast.success("Password reset email sent");
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setIsLoading(true);

    try {
      const { error } = await signIn.social({
        provider,
        callbackURL: dashboardUrl,
      });

      if (error) {
        toast.error(error.message || `Failed to sign in with ${provider}`);
        setIsLoading(false);
      }
    } catch {
      toast.error(`Failed to sign in with ${provider}`);
      setIsLoading(false);
    }
  };

  const backToEmailStep = () => {
    setAuthMode("email");
    form.setValue("password", "");
    form.setValue("name", "");
    form.setValue("otp", "");
    form.clearErrors();
    setIsResetPassword(false);
  };

  const titleByMode: Record<AuthMode, string> = {
    email: "Photographer Sign In",
    login: "Welcome back",
    register: "Create your photographer account",
    otp: "Enter verification code",
  };

  const subtitleByMode: Record<AuthMode, string> = {
    email: plan
      ? `Plan selected: ${plan}. Continue to set up your workspace.`
      : "Use email, social login, or one-time code.",
    login: `Sign in to continue with ${form.getValues("email")}.`,
    register: `Finish setup for ${form.getValues("email")}.`,
    otp: `We sent a 6-digit code to ${form.getValues("email")}.`,
  };

  return (
    <div
      className={cn("min-h-screen bg-[#f3f4ef] text-slate-900", className)}
      {...props}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-stretch px-4 py-6 sm:px-8 lg:px-10">
        <section className="relative flex w-full flex-1 flex-col justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.45)] sm:p-10 lg:max-w-[540px]">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.25),transparent_70%)]" />

          <div className="relative">
            <div className="mb-6 flex items-center justify-between">
              <img
                src="/logo.png"
                alt="FOTNO"
                className="h-10 w-36 object-contain"
              />
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                For Photographers
              </span>
            </div>

            {authMode !== "email" && (
              <Button
                type="button"
                variant="ghost"
                className="mb-4 h-auto p-0 text-sm text-slate-600 hover:bg-transparent hover:text-slate-900"
                onClick={backToEmailStep}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              {titleByMode[authMode]}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {subtitleByMode[authMode]}
            </p>

            <Form {...form}>
              <form
                className="mt-8 space-y-4"
                onSubmit={form.handleSubmit((values) => {
                  if (authMode === "email") {
                    handleEmailSubmit(values.email);
                    return;
                  }
                  handleAuthSubmit(values);
                })}
              >
                {(authMode === "email" ||
                  authMode === "login" ||
                  authMode === "register" ||
                  authMode === "otp") && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              {...field}
                              type="email"
                              placeholder="Email address"
                              autoComplete="email"
                              disabled={
                                isLoading ||
                                authMode === "login" ||
                                authMode === "register" ||
                                authMode === "otp"
                              }
                              className="h-12 border-slate-300 pl-10 focus-visible:ring-amber-500"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {authMode === "register" && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Full name"
                            autoComplete="name"
                            disabled={isLoading}
                            className="h-12 border-slate-300 focus-visible:ring-amber-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {(authMode === "login" || authMode === "register") && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        {authMode === "register" && (
                          <PasswordRequirements form={form} />
                        )}
                        <FormControl>
                          <div className="relative">
                            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder={
                                authMode === "login"
                                  ? "Password"
                                  : "Create password"
                              }
                              autoComplete={
                                authMode === "login"
                                  ? "current-password"
                                  : "new-password"
                              }
                              disabled={isLoading}
                              className="h-12 border-slate-300 pl-10 pr-10 focus-visible:ring-amber-500"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                              onClick={() => setShowPassword((prev) => !prev)}
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {authMode === "otp" && (
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            placeholder="6-digit code"
                            disabled={isLoading}
                            className="h-12 border-slate-300 text-center text-lg tracking-[0.35em] focus-visible:ring-amber-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {authMode === "login" && (
                  <div className="space-y-2 text-right">
                    <p
                      className={cn(
                        "text-xs text-emerald-700 transition-opacity",
                        isResetPassword ? "opacity-100" : "opacity-0",
                      )}
                    >
                      Reset email sent to {form.getValues("email")}
                    </p>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-medium text-slate-700 underline-offset-2 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {authMode === "otp" && (
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Didn&apos;t get the code?</span>
                    <button
                      type="button"
                      disabled={isSendingOtp || otpCountdown > 0}
                      className="font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={requestOtp}
                    >
                      {otpCountdown > 0
                        ? `Resend in ${otpCountdown}s`
                        : "Resend"}
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || isSendingOtp}
                  className="h-12 w-full bg-slate-900 text-white hover:bg-slate-800"
                >
                  {(isLoading || isSendingOtp) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {authMode === "email" && "Continue with email"}
                  {authMode === "login" && "Sign in"}
                  {authMode === "register" && "Create account"}
                  {authMode === "otp" && "Verify and sign in"}
                </Button>

                {authMode === "email" && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSendingOtp || isLoading}
                    className="h-12 w-full border-slate-300"
                    onClick={requestOtp}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Continue with one-time code
                  </Button>
                )}
              </form>
            </Form>

            {authMode === "email" && (
              <>
                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs uppercase tracking-wide text-slate-500">
                    or continue with
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    className="h-11 border-slate-300"
                    onClick={() => handleSocialSignIn("google")}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    className="h-11 border-slate-300"
                    onClick={() => handleSocialSignIn("github")}
                  >
                    <Github className="mr-2 h-4 w-4" /> GitHub
                  </Button>
                </div>
              </>
            )}

            <p className="mt-8 text-center text-xs text-slate-500">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>

        <aside className="relative hidden flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-[linear-gradient(145deg,#0f172a_0%,#1e293b_40%,#334155_100%)] p-10 lg:block">
          <div className="absolute -left-16 top-8 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl" />
          <div className="absolute -bottom-16 right-10 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="relative flex h-full flex-col justify-between text-white">
            <div>
              <p className="inline-flex rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/90">
                FOTNO Platform
              </p>
              <h2 className="mt-6 max-w-md text-4xl font-semibold leading-tight">
                Studio-grade account security for working photographers.
              </h2>
              <p className="mt-4 max-w-md text-sm text-slate-200">
                Password login, social OAuth, and email OTP in one place,
                optimized for fast access to your collections, deliveries, and
                billing tools.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm text-slate-100">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <p className="font-medium">Only photographers need accounts</p>
                <p className="mt-1 text-xs text-slate-200">
                  Clients continue to access galleries through secure share
                  links.
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <p className="font-medium">Session and device hardening</p>
                <p className="mt-1 text-xs text-slate-200">
                  Better Auth sessions are shared across FOTNO subdomains with
                  secure cookie policy.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
