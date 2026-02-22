import AppError from "../../errors/AppError";
import prisma from "../../../prisma";
import {
  ContactMethod,
  PhotographyLevel,
  UserOnboarding,
  UserType,
} from "@prisma/client";

interface Request {
  userType: UserType;
  companyName?: string;
  companySize?: string;
  photographyType: string[];
  photographyLevel?: PhotographyLevel;
  contactMethod?: ContactMethod;
  userId: string;
}

const AddUserOnboardingService = async ({
  userType,
  companyName,
  companySize,
  photographyType,
  photographyLevel,
  contactMethod,
  userId,
}: Request): Promise<UserOnboarding> => {
  // check if userOnboarding already exists
  const userOnboardingExists = await prisma.userOnboarding.findFirst({
    where: {
      userId: userId,
    },
  });

  if (userOnboardingExists) {
    return userOnboardingExists;
  }

  const userOnboarding: UserOnboarding = await prisma.userOnboarding
    .create({
      data: {
        userType,
        companyName,
        companySize,
        photographyType,
        photographyLevel,
        contactMethod,
        userId: userId,
      },
    })
    .catch((e) => {
      console.log(e);
      throw new AppError("Error adding user onboarding");
    });

  return userOnboarding;
};

export default AddUserOnboardingService;
