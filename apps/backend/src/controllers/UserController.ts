import { Request, Response } from "express";
import AppError from "../errors/AppError";
import controllerReturn from "../utils/successReturn";
import { prisma } from "@workspace/db";

export const checkEmailExists = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    // Check if user exists with this email
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true }, // Only select id to minimize data transfer
    });

    return res.status(200).json({
      exists: !!existingUser,
      message: existingUser
        ? "Email is already registered"
        : "Email is available",
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to check email", 500);
  }
};
