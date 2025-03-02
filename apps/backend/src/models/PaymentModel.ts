import mongoose, { Schema, Document } from "mongoose";

export interface PaymentShemaType extends Document {
  name: string;
  description: string;
  plan: string;
  planId: number;
  planExpiresAt: Date;
  planStartedAt: Date;
  subscriptionId: number;
}

const PaymentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    planId: {
      type: Number,
      required: true,
    },
    plan: {
      type: String,
      enum: ["BEGGINER", "PRO", "STUDIO"],
    },
    planExpiresAt: {
      type: Date,
    },
    planStartedAt: {
      type: Date,
    },
    subscriptionId: {
      type: Number,
      unique: true,
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

export const Payment = mongoose.model<PaymentShemaType>(
  "payment",
  PaymentSchema
);
