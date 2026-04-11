import { stripe } from "./stripe";
import { fetchTiersFromDB, STORAGE_TIERS } from "../../constants/plans";
import { fetchRegionalPricingFromDB } from "../../constants/regional-pricing";
import AppError from "../../errors/AppError";
import { getActiveSubscription } from "./getSubscription";
import { prisma } from "@workspace/db";

const findTierByLabel = (label: string) =>
  STORAGE_TIERS.find((t) => t.label.toLowerCase() === label.toLowerCase());

export const createSubscriptionIntent = async ({
  userId,
  tierLabel,
  countryCode,
}: {
  userId: string;
  tierLabel: string;
  countryCode?: string | null;
}) => {
  const activeSub = await getActiveSubscription(userId);
  if (activeSub && activeSub.status === "ACTIVE") {
    throw new AppError("User already has an active subscription", 409);
  }

  const dbTiers = await fetchTiersFromDB();
  const tier =
    dbTiers.find((t) => t.label.toLowerCase() === tierLabel.toLowerCase()) ??
    findTierByLabel(tierLabel);

  if (!tier || !tier.stripePriceId) {
    throw new AppError("Invalid tier", 400);
  }

  if (tier.gb === 0 || tier.priceCents === 0) {
    throw new AppError("Cannot create subscription for free tier", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, stripeCustomerId: true },
  });

  if (!user) throw new AppError("User not found", 404);

  let stripeCustomerId = user.stripeCustomerId;

  const customerAddress = countryCode
    ? { address: { country: countryCode } }
    : {};

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: { user_id: userId },
      ...customerAddress,
    });
    stripeCustomerId = customer.id;
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId },
    });
  } else if (countryCode) {
    await stripe.customers.update(stripeCustomerId, customerAddress);
  }

  const regional = await fetchRegionalPricingFromDB(countryCode);

  const regionalCheckoutCents = regional?.tierCheckoutCents?.[tier.gb];

  const sharedMetadata = {
    user_id: userId,
    tier_gb: String(tier.gb),
    ...(countryCode ? { country_code: countryCode } : {}),
  };

  let items: any[] = [];
  if (regionalCheckoutCents) {
    let productId: string;
    try {
      const existingPrice = await stripe.prices.retrieve(tier.stripePriceId);
      productId = existingPrice.product as string;
    } catch {
      throw new AppError(
        "Stripe price for this tier is no longer valid. Please contact support.",
        500,
      );
    }
    items = [
      {
        price_data: {
          currency: "usd",
          unit_amount: regionalCheckoutCents,
          recurring: { interval: "month" as const },
          product: productId,
        },
      },
    ];
  } else {
    items = [{ price: tier.stripePriceId }];
  }

  // Build display price info for the frontend
  // For regional users, show the local currency price (e.g. "EGP 300")
  // For everyone else, show the base USD price
  const displayCents = regional?.tierPrices?.[tier.gb] ?? tier.priceCents;
  const displayCurrency = regional?.currency ?? "USD";
  const displayLocale = regional?.locale ?? "en-US";
  const displayPrice = {
    amount: displayCents,
    currency: displayCurrency,
    symbol: regional?.symbol ?? "$",
    locale: displayLocale,
    formatted: new Intl.NumberFormat(displayLocale, {
      style: "currency",
      currency: displayCurrency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(displayCents / 100),
  };

  // Check if the customer already has a saved payment method (e.g. from onboarding card save)
  const paymentMethods = await stripe.paymentMethods.list({
    customer: stripeCustomerId,
    type: "card",
    limit: 1,
  });
  const savedPaymentMethod = paymentMethods.data[0]?.id;

  const subscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items,
    metadata: sharedMetadata,
    payment_behavior: "default_incomplete",
    payment_settings: {
      save_default_payment_method: "on_subscription",
      payment_method_types: ["card"],
    },
    automatic_tax: { enabled: !!countryCode },
    ...(savedPaymentMethod ? { default_payment_method: savedPaymentMethod } : {}),
  });

  // If the customer had a saved card, Stripe may have auto-charged it
  if (subscription.status === "active") {
    return {
      data: {
        subscriptionId: subscription.id,
        status: "active",
        displayPrice,
      },
      status: 201,
    };
  }

  // In Stripe API 2026-03-25.dahlia, the payment_intent field was removed from
  // invoices. The PaymentIntent IS created but must be retrieved separately.
  const paymentIntents = await stripe.paymentIntents.list({
    customer: stripeCustomerId,
    limit: 1,
  });

  const clientSecret = paymentIntents.data[0]?.client_secret;

  if (!clientSecret) {
    throw new AppError("Failed to create subscription payment intent", 500);
  }

  return {
    data: {
      subscriptionId: subscription.id,
      clientSecret,
      status: "requires_payment",
      displayPrice,
    },
    status: 201,
  };
};
