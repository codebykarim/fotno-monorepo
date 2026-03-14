import { betterAuth } from "better-auth";
import { sendMail } from "./utils/sendMail";
import { admin, emailOTP, openAPI } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@workspace/db";

const hasGoogleOAuth =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);

const hasGithubOAuth =
  Boolean(process.env.GITHUB_CLIENT_ID) &&
  Boolean(process.env.GITHUB_CLIENT_SECRET);

  console.log("hasGithubOAuth", hasGithubOAuth, "hasGoogleOAuth", hasGoogleOAuth);

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url, token }, request) => {
      // Properly construct the URL with email parameter
      const urlObj = new URL(url);
      urlObj.searchParams.set("email", user.email);
      const resetUrl = urlObj.toString();

      await sendMail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${resetUrl}`,
      });
    },
  },
  socialProviders: {
    ...(hasGoogleOAuth
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            accessType: "offline",
            prompt: "consent",
          },
        }
      : {}),
    ...(hasGithubOAuth
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
          },
        }
      : {}),
  },
  plugins: [
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await sendMail({
          to: email,
          subject: "Your FOTNO verification code",
          text: `<p>Your one-time code is: <strong>${otp}</strong></p><p>This code expires in 5 minutes.</p><p>Request type: ${type}</p>`,
        });
      },
    }),
    openAPI(),
  ],
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      subscribed: {
        type: "boolean",
        default: false,
      },
      finishOnboarding: {
        type: "boolean",
        default: false,
      },
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: process.env.NODE_ENV === "production" ? ".fotno.com" : undefined, // Domain with a leading period
    },
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: "none", // Allows CORS-based cookie sharing across subdomains
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:3005",
    "https://www.fotno.com",
    "https://fotno.com",
    "https://auth.fotno.com",
    "https://admin.fotno.com",
    "https://gallery.fotno.com",
    "https://api.fotno.com",
    "https://upload.fotno.com",
    "https://app.fotno.com",
    "https://gallery.fotno.com",
  ],
  // emailVerification: {
  //   sendVerificationEmail: async ({ user, url, token }, request) => {
  //     await sendMail({
  //       to: user.email,
  //       subject: "Verify your email address",
  //       text: `Click the link to verify your email: ${url}`,
  //     });
  //   },
  // },
});
