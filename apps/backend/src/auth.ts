import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { database } from "./mongodb/db";
import { sendMail } from "./utils/sendMail";
import { admin, jwt, bearer, openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  database: mongodbAdapter(database),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  plugins: [admin(), openAPI()],
  user: {
    deleteUser: {
      enabled: true,
    },
  },
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
