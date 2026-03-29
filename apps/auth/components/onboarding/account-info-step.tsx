"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, Loader2, Mail } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { signUp } from "@workspace/lib/auth/auth-client";
import { checkEmailExists } from "@/lib/email-check";
import PasswordRequirements from "../password-req";
import Link from "next/link";

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

type FormData = z.infer<typeof registerSchema>;

interface AccountInfoStepProps {
  plan: string;
  onSuccess: () => void;
}

export function AccountInfoStep({ plan, onSuccess }: AccountInfoStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailTakenError, setEmailTakenError] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setEmailTakenError(false);

    try {
      // 1. Check if email exists
      const checkResult = await checkEmailExists(values.email.toLowerCase());
      if (checkResult.exists) {
        setEmailTakenError(true);
        form.setError("email", { type: "manual", message: " " });
        setIsLoading(false);
        return;
      }

      // 2. Sign up user
      const result = new Promise<void>((resolve, reject) => {
        signUp.email(
          {
            email: values.email.toLowerCase(),
            password: values.password,
            name: values.name,
            subscribed: false,
            finishOnboarding: false, // Keep them in onboarding state
          },
          {
            onSuccess: () => resolve(),
            onError: (error: any) =>
              reject({
                message: error?.error?.message || "Failed to create account",
              }),
          }
        );
      });

      toast.promise(result, {
        loading: "Creating account...",
        success: () => {
          onSuccess(); // Advance to stripe step
          return "Account created successfully";
        },
        error: (error: { message: string }) => {
          setIsLoading(false);
          return error.message;
        },
      });
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your selected plan is <strong>{plan}</strong>. Let&apos;s get started.
      </p>

      {emailTakenError && (
        <div className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
          This email is already registered.{" "}
          <Link href={`/account?email=${encodeURIComponent(form.getValues("email"))}`} className="font-semibold underline underline-offset-2">
            Sign in instead
          </Link>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
                      disabled={isLoading}
                      className="h-12 border-border pl-10 focus-visible:ring-primary"
                    />
                  </div>
                </FormControl>
                {!emailTakenError && <FormMessage />}
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <PasswordRequirements form={form as any} />
                <FormControl>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      autoComplete="new-password"
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

          <Button
            type="submit"
            disabled={isLoading}
            className="auth-cta mt-6 h-12 w-full text-primary-foreground"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
}
