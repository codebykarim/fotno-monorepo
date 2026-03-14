import { auth } from "../../auth";

export const setRole = async (userId: string, role: "admin" | "user") => {
  await auth.api.setRole({
    body: { userId, role },
    headers: new Headers(),
  });
  return { success: true };
};
