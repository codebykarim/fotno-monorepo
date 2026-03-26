import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  console.warn("STRIPE_SECRET_KEY not configured — billing features disabled");
}

export const stripe = secretKey
  ? new Stripe(secretKey, { apiVersion: "2025-04-30.basil" })
  : (null as unknown as Stripe);

export { Stripe };
