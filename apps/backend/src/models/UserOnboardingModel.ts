import mongoose, { Schema, Document } from "mongoose";

interface UserOnboardingSchemaType extends Document {
  userId: string;
  companyName: string;
  companySize: string;
  photographyType: string;
  photographyLevel: string;
  contactMethod: string;
}

const UserOnboardingSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
    },
    companyName: {
      type: String,
    },
    companySize: {
      type: String,
    },
    photographyType: {
      type: String,
    },
    photographyLevel: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "PROFESSIONAL"],
    },
    contactMethod: {
      type: String,
      enum: ["EMAIL", "PHONE", "BOTH"],
    },
  },
  {
    timestamps: true,
    id: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export const UserOnboarding = mongoose.model<UserOnboardingSchemaType>(
  "userOnboarding",
  UserOnboardingSchema
);
