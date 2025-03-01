import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { database } from "./mongodb/db";
import { sendMail } from "./utils/sendMail";
import { admin, openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  database: mongodbAdapter(database),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendMail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
  plugins: [admin(), openAPI()],
  user: {
    deleteUser: {
      enabled: true,
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
    "https://www.fotno.com",
    "https://auth.fotno.com",
    "https://dashboard.fotno.com",
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
