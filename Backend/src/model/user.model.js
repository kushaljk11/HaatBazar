import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "buyer", "farmer"],
      default: "buyer",
    },
    phone: {
      type: String,
    },
    location: {
      type: String,
    },
    gender: {
        type: String,
      enum: ["male", "female", "other"],
    },
    primaryCrop: {
        type: String,
      enum: ["grains", "fruits", "vegetables", "other"],
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    profilePicture: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", UserSchema, "users");
