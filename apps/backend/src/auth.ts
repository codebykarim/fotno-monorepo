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
          await prisma.user.update({
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
        text: `<p style="color:rgb(55,65,81);font-size:16px;margin:0 0 24px;line-height:24px;">We received a request to reset your Fotno password. Click the button below to set a new one.</p>
<a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background-color:#c97a3a;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Reset Password</a>
<p style="color:rgb(17,24,39);font-size:15px;margin:24px 0 0;line-height:24px;">If you didn't request this, you can safely ignore this email.</p>`,
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
          text: `<p style="color:rgb(55,65,81);font-size:16px;margin:0 0 24px;line-height:24px;">Your Fotno verification code is:</p>
<div style="background-color:rgb(254,247,237);border-radius:8px;padding:16px 24px;display:inline-block;margin-bottom:24px;">
  <p style="color:rgb(17,24,39);font-size:40px;font-weight:700;margin:0;line-height:48px;letter-spacing:4px;">${otp}</p>
</div>
<p style="color:rgb(17,24,39);font-size:15px;margin:0;line-height:24px;">This code will expire in 5 minutes and can only be used once. Never share this code with anyone.</p>`,
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
