import { auth } from "../../auth";

export const setRole = async (userId: string, role: string) => {
  await auth.api.setRole({
    body: { userId, role },
  });
  return { success: true };
};
