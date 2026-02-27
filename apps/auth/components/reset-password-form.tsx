"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Icons } from "@workspace/ui/components/icons";
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
      <div className="min-h-screen flex-1 bg-card/90 px-4 py-8 sm:px-6 lg:min-h-0 lg:px-20 xl:px-24 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
              FOTNO
            </span>
          </div>

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

      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(145deg, oklch(0.16 0.01 50) 0%, oklch(0.20 0.01 50) 40%, oklch(0.25 0.01 50) 100%)" }}>
          <div className="absolute -left-16 top-8 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute -bottom-16 right-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

          <div className="relative flex h-full flex-col items-center justify-center text-white p-10">
            <Icons.logo className="h-16 w-16 text-primary mb-6" />
            <h2 className="max-w-md text-3xl font-semibold leading-tight text-center">
              Secure your account, protect your work.
            </h2>
            <p className="mt-4 max-w-sm text-sm text-white/60 text-center">
              A strong password keeps your galleries, clients, and billing information safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
