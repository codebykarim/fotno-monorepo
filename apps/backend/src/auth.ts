import { betterAuth } from "better-auth";
import { sendMail } from "./utils/sendMail";
import { admin, emailOTP, multiSession, openAPI } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@workspace/db";
import { getFreeTierLimits } from "./constants/plans";

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
    provider: "postgresql",
  }),
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // New users start on the Free tier — limits read from PricingTier DB
          const freeLimits = await getFreeTierLimits();
          await (prisma as any).user.update({
            where: { id: user.id },
            data: {
              plan: "FREE",
              storageLimit: freeLimits.storageLimitBytes,
              galleryLimit: freeLimits.galleryLimit,
            },
          });
        },
      },
    },
  },
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
        text: `<h2 style="margin:0 0 8px;font-size:18px;font-weight:600;">Reset Your Password</h2>
<p style="margin:0 0 20px;color:#374151;">We received a request to reset your password. Click the button below to set a new one.</p>
<a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background-color:#c97a3a;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a>
<p style="margin:20px 0 0;color:#6b7280;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>`,
        showFooterLinks: false,
        preheaderText: "Reset your Fotno password",
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
          text: `<h2 style="margin:0 0 16px;font-size:18px;font-weight:600;">Your Verification Code</h2>
<div style="margin:0 0 20px;padding:16px 24px;background:#f3f4f6;border-radius:8px;text-align:center;font-size:32px;letter-spacing:8px;font-weight:700;font-family:'Courier New',monospace;color:#111827;">${otp}</div>
<p style="margin:0;color:#6b7280;font-size:13px;">This code expires in 5 minutes.</p>`,
          showFooterLinks: false,
          preheaderText: `Your verification code is ${otp}`,
        });
      },
    }),
    openAPI(),
    multiSession(),
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
  account: {
    accountLinking: {
      allowDifferentEmails: true,
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
