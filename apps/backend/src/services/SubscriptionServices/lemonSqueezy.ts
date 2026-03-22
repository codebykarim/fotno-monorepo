import {
  lemonSqueezySetup,
  createCheckout as lsCreateCheckout,
  cancelSubscription as lsCancelSubscription,
  getSubscription as lsGetSubscription,
  updateSubscription as lsUpdateSubscription,
  getCustomer as lsGetCustomer,
  listSubscriptions as lsListSubscriptions,
} from "@lemonsqueezy/lemonsqueezy.js";

const apiKey = process.env.LEMONSQUEEZY_API_KEY;

if (apiKey) {
  lemonSqueezySetup({ apiKey });
}

export {
  lsCreateCheckout,
  lsCancelSubscription,
  lsGetSubscription,
  lsUpdateSubscription,
  lsGetCustomer,
  lsListSubscriptions,
};
