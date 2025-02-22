import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    token: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
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

const Session = mongoose.model("session", SessionSchema);

const AccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    accountId: {
      type: String,
    },
    providerId: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    accessTokenExpiresAt: {
      type: Date,
    },
    refreshTokenExpiresAt: {
      type: Date,
    },
    scope: {
      type: String,
    },
    idToken: {
      type: String,
    },
    password: {
      type: String,
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

const Account = mongoose.model("account", AccountSchema);

const VerificationSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
    },
    value: {
      type: String,
    },
    expiresAt: {
      type: Date,
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

const Verification = mongoose.model("verification", VerificationSchema);

export { Session, Account, Verification };
