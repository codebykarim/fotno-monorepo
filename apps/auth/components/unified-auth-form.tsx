"use client";

import { type ComponentProps, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Input } from "@workspace/ui/components/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Icons } from "@workspace/ui/components/icons";
import {
  requestPasswordReset,
  getSession,
  sendVerificationOTP,
  signIn,
  signOut,
  signUp,
  updateUser,
} from "@workspace/lib/auth/auth-client";
import Logo from "@workspace/ui/components/logo";

import PasswordRequirements from "./password-req";
import { checkEmailExists } from "@/lib/email-check";
import { identifyUser } from "@/lib/rybbit";

export type AuthMode = "email" | "login" | "register" | "otp";

export interface AuthFormData {
  email: string;
  password: string;
  name: string;
  otp: string;
  agreedToTerms: boolean;
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

const DEFAULT_DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "/";
const LANDING_URL = process.env.NEXT_PUBLIC_LANDING_URL || "https://fotno.com";

function UnifiedAuthFormComponent({
  className,
  resetEmail,
  addAccountMode = false,
  plan,
  callbackURL,
  ...props
}: ComponentProps<"div"> & {
  resetEmail?: string | string[] | undefined;
  /** Multi-session: sign in with another account while already signed in */
  addAccountMode?: boolean;
  plan?: string;
  callbackURL?: string;
}) {
  const [authMode, setAuthMode] = useState<AuthMode>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isNewOtpUser, setIsNewOtpUser] = useState(false);

  const router = useRouter();

  const postAuthRedirectUrl = useMemo(() => {
    // When registering, redirect to onboarding (same auth app, not dashboard)
    if (authMode === "register") {
      const planParam = plan ? `plan=${encodeURIComponent(plan)}&` : "";
      return `/onboarding?${planParam}step=stripe`;
    }

    const raw = callbackURL;

    if (!raw) return DEFAULT_DASHBOARD_URL;
    try {
      if (raw.startsWith("/") && !raw.startsWith("//")) {
        const base = DEFAULT_DASHBOARD_URL.startsWith("http")
          ? DEFAULT_DASHBOARD_URL
          : "http://localhost:3001";
        return new URL(raw, base.endsWith("/") ? base : `${base}/`).toString();
      }
      const parsed = new URL(raw);
      const baseOrigin = new URL(
        DEFAULT_DASHBOARD_URL.startsWith("http")
          ? DEFAULT_DASHBOARD_URL
          : "http://localhost:3001",
      ).origin;
      if (parsed.origin === baseOrigin) return raw;
    } catch {
      /* ignore invalid callback */
    }
    return DEFAULT_DASHBOARD_URL;
  }, [callbackURL, authMode, plan]);

  const form = useForm<AuthFormData>({
    defaultValues: {
      email: typeof resetEmail === "string" ? resetEmail : "",
      password: "",
      name: "",
      otp: "",
      agreedToTerms: false,
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
    if (postAuthRedirectUrl.startsWith("http")) {
      window.location.href = postAuthRedirectUrl;
      return;
    }

    router.push(postAuthRedirectUrl);
  };

  const checkNotAdminThenRedirect = async (): Promise<boolean> => {
    const sessionResponse = await getSession();
    const session = (sessionResponse as any)?.data;
    if ((session?.user as any)?.role === "admin") {
      await signOut();
      toast.error("Admin accounts cannot sign in here. Use the admin panel.");
      setIsLoading(false);
      return false;
    }
    redirectToDashboard();
    return true;
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
      const emailCheck = await checkEmailExists(parsed.data.email);
      setIsNewOtpUser(!emailCheck.exists);

      const otpResponse = await sendVerificationOTP({
        email: parsed.data.email,
        type: "sign-in",
      });
      const error = (otpResponse as any)?.error;

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
            callbackURL: postAuthRedirectUrl,
            rememberMe: true,
          },
          {
            onSuccess: (context: any) =>
              resolve({ email: context.data?.user?.email }),
            onError: (error: unknown) =>
              reject({ message: getErrorMessage(error, "Failed to log in") }),
          },
        );
      });

      toast.promise(result, {
        loading: "Logging you in...",
        success: async (data) => {
          if (data?.email) identifyUser(data.email, { email: data.email });
          const allowed = await checkNotAdminThenRedirect();
          if (!allowed) return "Access denied";
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

      if (!values.agreedToTerms) {
        form.setError("agreedToTerms", {
          type: "manual",
          message:
            "You must agree to the Terms, Privacy Policy, and Refund Policy",
        });
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
            callbackURL: postAuthRedirectUrl,
          },
          {
            onSuccess: (context: any) =>
              resolve({ email: context.data?.user?.email }),
            onError: (error: unknown) =>
              reject({
                message: getErrorMessage(error, "Failed to create account"),
              }),
          },
        );
      });

      toast.promise(result, {
        loading: "Creating your account...",
        success: (data) => {
          if (data?.email) identifyUser(data.email, { email: data.email });
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

      if (isNewOtpUser) {
        const name = payload.name?.trim();
        if (!name || name.length < 2) {
          form.setError("name", {
            type: "manual",
            message: "Name must be at least 2 characters",
          });
          return;
        }
        if (!values.agreedToTerms) {
          form.setError("agreedToTerms", {
            type: "manual",
            message:
              "You must agree to the Terms, Privacy Policy, and Refund Policy",
          });
          return;
        }
      }

      setIsLoading(true);
      const result = new Promise<void>((resolve, reject) => {
        signIn.emailOtp(
          {
            email: parsed.data.email,
            otp: parsed.data.otp,
          },
          {
            onSuccess: async () => {
              if (isNewOtpUser && payload.name?.trim()) {
                try {
                  await updateUser({
                    name: payload.name.trim(),
                  });
                } catch {
                  // non-critical, continue
                }
              }
              resolve();
            },
            onError: (error: unknown) =>
              reject({
                message: getErrorMessage(error, "Invalid verification code"),
              }),
          },
        );
      });

      toast.promise(result, {
        loading: "Verifying your code...",
        success: async () => {
          const email = parsed.data.email;
          identifyUser(email, { email });
          if (isNewOtpUser) {
            const planParam = plan ? `plan=${encodeURIComponent(plan)}&` : "";
            const onboardingUrl = `/onboarding?${planParam}step=stripe`;
            router.push(onboardingUrl);
            return "Account created successfully";
          }
          const allowed = await checkNotAdminThenRedirect();
          if (!allowed) return "Access denied";
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

    const { error } = await requestPasswordReset({
      email: parsed.data.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast.error(error.message || "Failed to send reset email");
    } else {
      setIsResetPassword(true);
      toast.success("Password reset email sent. Check your inbox.");
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setIsLoading(true);

    try {
      const origin = window.location.origin;
      const planParam = plan ? `plan=${encodeURIComponent(plan)}&` : "";
      const oauthRedirectUrl = `${origin}/onboarding?${planParam}step=stripe`;

      const response = await signIn.social({
        provider,
        callbackURL: oauthRedirectUrl,
        errorCallbackURL: `${origin}/account`,
      });

      if ((response as any).error) {
        toast.error(
          (response as any).error.message ||
            `Failed to sign in with ${provider}`,
        );
        setIsLoading(false);
      } else if ((response as any).data?.url) {
        window.location.href = (response as any).data.url;
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
    form.setValue("agreedToTerms", false);
    form.clearErrors();
    setIsResetPassword(false);
    setIsNewOtpUser(false);
  };

  const titleByMode: Record<AuthMode, string> = {
    email: addAccountMode
      ? "Log in to another account"
      : "Photographer Sign In",
    login: "Welcome back",
    register: "Create your photographer account",
    otp: isNewOtpUser ? "Create your account" : "Enter verification code",
  };

  const subtitleByMode: Record<AuthMode, string> = {
    email: addAccountMode
      ? "You stay signed in to your current account. Use a different email or social login."
      : plan
        ? `Plan selected: ${plan}. Continue to set up your workspace.`
        : "Use email, social login, or one-time code.",
    login: `Sign in to continue with ${form.getValues("email")}.`,
    register: `Finish setup for ${form.getValues("email")}.`,
    otp: isNewOtpUser
      ? `Enter your name and the code we sent to ${form.getValues("email")}.`
      : `We sent a 6-digit code to ${form.getValues("email")}.`,
  };

  return (
    <div
      className={cn("min-h-screen bg-background text-foreground", className)}
      {...props}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-stretch px-4 py-6 sm:px-8 lg:px-10">
        <section className="relative flex w-full flex-1 flex-col justify-center overflow-hidden rounded-tl-3xl border border-border bg-card p-6 shadow-sm sm:p-10 lg:max-w-[540px]">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_oklch(0.72_0.14_65_/_0.15),transparent_70%)]" />

          <div className="relative">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <span className="rounded-full border border-primary/30 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                For Photographers
              </span>
            </div>

            {authMode !== "email" && (
              <Button
                type="button"
                variant="ghost"
                className="mb-4 h-auto p-0 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground"
                onClick={backToEmailStep}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}

            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {titleByMode[authMode]}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
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
                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                              className="h-12 border-border pl-10 focus-visible:ring-primary"
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
                            className="h-12 border-border focus-visible:ring-primary"
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
                            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                              className="h-12 border-border pl-10 pr-10 focus-visible:ring-primary"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
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

                {authMode === "otp" && isNewOtpUser && (
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
                            className="h-12 border-border focus-visible:ring-primary"
                          />
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
                          <InputOTP
                            maxLength={6}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isLoading}
                          >
                            <InputOTPGroup className="w-full justify-center">
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {(authMode === "register" ||
                  (authMode === "otp" && isNewOtpUser)) && (
                  <FormField
                    control={form.control}
                    name="agreedToTerms"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start gap-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading}
                              className="mt-0.5"
                            />
                          </FormControl>
                          <label className="text-sm leading-snug text-muted-foreground">
                            I agree to the{" "}
                            <a
                              href={`${LANDING_URL}/terms-and-conditions`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground underline underline-offset-2"
                            >
                              Terms and Conditions
                            </a>
                            ,{" "}
                            <a
                              href={`${LANDING_URL}/privacy-policy`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground underline underline-offset-2"
                            >
                              Privacy Policy
                            </a>
                            , and{" "}
                            <a
                              href={`${LANDING_URL}/refund-policy`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground underline underline-offset-2"
                            >
                              Refund Policy
                            </a>
                          </label>
                        </div>
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
                      className="text-xs font-medium text-foreground underline-offset-2 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {authMode === "otp" && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Didn&apos;t get the code?</span>
                    <button
                      type="button"
                      disabled={isSendingOtp || otpCountdown > 0}
                      className="font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="auth-cta h-12 w-full text-primary-foreground"
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
                    className="h-12 w-full border-border"
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
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    or continue with
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    className="h-11 border-border"
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

                  {/* <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    className="h-11 border-border"
                    onClick={() => handleSocialSignIn("github")}
                  >
                    <Github className="mr-2 h-4 w-4" /> GitHub
                  </Button> */}
                </div>
              </>
            )}

            <p className="mt-8 text-center text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <a
                href={`${LANDING_URL}/terms-and-conditions`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Terms
              </a>
              ,{" "}
              <a
                href={`${LANDING_URL}/privacy-policy`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Privacy Policy
              </a>
              , and{" "}
              <a
                href={`${LANDING_URL}/refund-policy`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Refund Policy
              </a>
              .
            </p>
          </div>
        </section>

        <aside
          className="relative hidden flex-1 overflow-hidden rounded-tr-3xl border border-border p-10 lg:block"
          style={{
            background:
              "linear-gradient(145deg, oklch(0.16 0.01 50) 0%, oklch(0.20 0.01 50) 40%, oklch(0.25 0.01 50) 100%)",
          }}
        >
          <div className="absolute -left-16 top-8 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute -bottom-16 right-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

          <div className="relative flex h-full flex-col justify-between text-white">
            <div>
              <p className="inline-flex rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary">
                FOTNO Platform
              </p>
              <h2 className="mt-6 max-w-md text-4xl font-semibold leading-tight">
                Studio-grade account security for working photographers.
              </h2>
              <p className="mt-4 max-w-md text-sm text-white/70">
                Password login, social OAuth, and email OTP in one place --
                optimized for fast access to your collections, deliveries, and
                billing tools.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm text-white/90">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="font-medium">Only photographers need accounts</p>
                <p className="mt-1 text-xs text-white/60">
                  Clients continue to access galleries through secure share
                  links.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="font-medium">Session and device hardening</p>
                <p className="mt-1 text-xs text-white/60">
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

export function UnifiedAuthForm({
  className,
  resetEmail,
  addAccountMode = false,
  plan,
  callbackURL,
  ...props
}: ComponentProps<"div"> & {
  resetEmail?: string | string[] | undefined;
  /** Multi-session: sign in with another account while already signed in */
  addAccountMode?: boolean;
  plan?: string;
  callbackURL?: string;
}) {
  return (
    <UnifiedAuthFormComponent
      className={className}
      resetEmail={resetEmail}
      addAccountMode={addAccountMode}
      plan={plan}
      callbackURL={callbackURL}
      {...props}
    />
  );
}
