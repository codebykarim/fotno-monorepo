import { createAuthClient } from "better-auth/react";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient(
  {
    baseURL: process.env.NEXT_PUBLIC_API_URL, // the base url of your auth server
    plugins: [],
  }
);
