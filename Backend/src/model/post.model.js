import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      default: "Other",
      trim: true,
      index: true,
    },
    region: {
      type: String,
      default: "Unknown",
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      default: "kg",
      trim: true,
    },
    stockKg: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    tag: {
      type: String,
      default: "Fresh",
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "sold"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema, "posts");
