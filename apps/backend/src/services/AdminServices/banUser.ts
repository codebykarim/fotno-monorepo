import { auth } from "../../auth";

export const banUser = async (userId: string, reason?: string) => {
  await auth.api.banUser({
    body: {
      userId,
      banReason: reason,
    },
  });
  return { success: true };
};
