import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export const logout = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        redirect(process.env.NEXT_PUBLIC_LANDING_URL as string);
      },
    },
  });
};
