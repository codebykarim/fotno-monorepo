import { auth } from "../../auth";

export const unbanUser = async (userId: string) => {
  await auth.api.unbanUser({
    body: { userId },
  });
  return { success: true };
};
