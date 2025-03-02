import mongoose, { PopulatedDoc, Schema, Document } from "mongoose";
import { PaymentShemaType } from "./PaymentModel";

interface UserSchemaType extends Document {
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  payment?: PopulatedDoc<PaymentShemaType>;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
    },
    image: {
      type: String,
    },
    userOnboarding: {
      type: "ObjectId",
      ref: "userOnboarding", // reference to the userOnboarding model
    },
    payment: {
      type: "ObjectId",
      ref: "payment", // reference to the payment model
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

export const User = mongoose.model<UserSchemaType>("user", UserSchema);
