import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { ClientOptions } from "better-auth";

type AuthClient = ReturnType<typeof createAuthClient<ClientOptions>>;

interface AdditionalUserFields {
  subscribed: boolean;
  finishOnboarding: boolean;
}

const authClient: AuthClient = createAuthClient<ClientOptions>({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // the base url of your auth server
  disableDefaultFetchPlugins: true,
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

export const {
  getSession,
  signIn,
  signOut,
  useSession,
  signUp,
  forgetPassword,
  resetPassword,
} = authClient;

type Session = typeof authClient.$Infer.Session;
export type ExtendedSession = Omit<Session, "user"> & {
  user: Session["user"] & AdditionalUserFields;
};
