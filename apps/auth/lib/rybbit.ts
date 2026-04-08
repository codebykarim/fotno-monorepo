export const trackEvent = (name: string, data?: Record<string, any>) => {
  if (
    typeof window !== "undefined" &&
    (window as any).rybbit &&
    typeof (window as any).rybbit.event === "function"
  ) {
    (window as any).rybbit.event(name, data);
  }
};

export const identifyUser = (
  userId: string,
  traits?: Record<string, unknown>,
) => {
  if (
    typeof window !== "undefined" &&
    (window as any).rybbit &&
    typeof (window as any).rybbit.identify === "function"
  ) {
    (window as any).rybbit.identify(userId, traits);
  }
};
