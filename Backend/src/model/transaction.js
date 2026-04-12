import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    product_name: {
      type: String,
      required: true,
    },
    product_id: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    quantity: {
      type: Number,
      min: 1,
    },
    deliveryAddress: {
      type: String,
      default: "",
    },
    payment_gateway: {
      type: String,
      enum: ["esewa", "khalti"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Transaction", transactionSchema);
