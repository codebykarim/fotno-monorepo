import "better-auth/types";

declare module "better-auth/types" {
  interface User {
    finishOnboarding?: boolean;
    subscribed?: boolean;
  }
}
