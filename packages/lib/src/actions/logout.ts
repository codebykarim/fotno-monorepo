"use server";

import { signOut } from "@workspace/lib/auth/auth-client";
import { ErrorContext } from "better-auth/react";
import { redirect } from "next/navigation";

export const logout = async () => {
  await signOut({
    fetchOptions: {
      onSuccess: () => {
        redirect(process.env.NEXT_PUBLIC_LANDING_URL as string);
      },
      onError: (error: ErrorContext) => {
        console.error("Logout error:", error);
      },
    },
  });
};
