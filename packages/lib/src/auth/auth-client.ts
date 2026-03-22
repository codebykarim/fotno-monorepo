import { inferAdditionalFields, multiSessionClient } from "better-auth/client/plugins";
import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

interface AdditionalUserFields {
  subscribed: boolean;
  finishOnboarding: boolean;
}

const authClient = createAuthClient({
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
    emailOTPClient(),
    multiSessionClient()
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
  linkSocial,
  multiSession,
} = authClient;

export const sendVerificationOTP = authClient.emailOtp.sendVerificationOtp;

type BaseSessionUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
};

export type ExtendedSession = {
  user: BaseSessionUser & AdditionalUserFields;
  session?: Record<string, unknown>;
  [key: string]: unknown;
};
