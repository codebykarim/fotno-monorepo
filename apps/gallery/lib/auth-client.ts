import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // the base url of your auth server
  plugins: [
    inferAdditionalFields({
      user: {
        subscribed: {
          type: "boolean",
          default: false,
        },
        finishOnboarding: {
          type: "boolean",
          default: false,
        },
      },
    }),
  ],
});

export type Session = typeof authClient.$Infer.Session;
