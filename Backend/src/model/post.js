import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postLocation: {
      type: String,
      required: true,
    },
    postTitle: {
      type: String,
      required: true,
    },
    postDescription: {
      type: String,
      required: true,
    },
    postImage: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    variety: {
      type: String,
      required: true,
    },
    contactInfo: {
      type: String,
      required: true,
    },
    minimumOrder: {
      type: Number,
      required: true,
    },
    tag: {
      type: String,
      required: true,
      enum: [
        "vegetables",
        "fruits",
        "grains",
        "dairy",
        "meat",
        "poultry",
        "other",
      ],
    },
    status: {
      type: String,
      enum: ["Available", "Sold Out"],
      default: "Available",
    },
    adminApproval: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Post", PostSchema);