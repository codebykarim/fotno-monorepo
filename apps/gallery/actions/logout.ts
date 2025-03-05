import { signOut } from "@workspace/lib/auth/auth-client";
import { redirect } from "next/navigation";

export const logout = async () => {
  await signOut({
    fetchOptions: {
      onSuccess: () => {
        redirect(process.env.NEXT_PUBLIC_LANDING_URL as string);
      },
    },
  });
};
