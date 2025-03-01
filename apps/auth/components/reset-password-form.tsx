"use client";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@workspace/ui/lib/utils";

import { Button } from "@workspace/ui/components/button";

import { Card, CardContent } from "@workspace/ui/components/card";

import { Input } from "@workspace/ui/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { useRouter } from "next/navigation";
type Props = {
  token: string | string[];
};

const formSchema = z.object({
  password: z.string().min(2).max(50),
  confirmPassword: z.string().min(2).max(50),
});

export const ResetPasswordForm = ({ token }: Props) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const res = new Promise<{ success?: string }>((resolve, reject) => {
      authClient.resetPassword(
        {
          newPassword: values.password,
          token: token as string,
        },
        {
          onSuccess: (data) => {
            resolve({ success: data.data });
          },
          onError: (error) => {
            console.log(error);
            reject({ message: error.error.message ?? "Unknown error" });
          },
        }
      );
    });

    toast.promise(res, {
      loading: "Resetting password...",
      success: () => {
        router.push("/login");
        return `Password reset successful`;
      },
      error: (error: { message: string }) => {
        return `Failed to reset password: ${error.message}`;
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden bg-foreground">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6 text-muted-foreground">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Reset your password</h1>
                  <p className="text-balance ">
                    Please enter your new password below.
                  </p>
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            placeholder="********"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="********"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              </div>
            </form>
          </Form>
          <div className="relative hidden bg-background md:block">
            <Image
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
              fill
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By continue, you agree to our{" "}
        <a href="/terms-of-service">Terms of Service</a> and{" "}
        <a href="/privacy-policy">Privacy Policy</a>.
      </div>
    </div>
  );
};
