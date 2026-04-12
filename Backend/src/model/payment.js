import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    paymentId: {
        type: String,
        required: true,
        unique: true
    },

    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    method: {
        type: String,
        enum: ["cod", "esewa", "khalti", "bank_transfer", "wallet"],
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "success", "failed", "refunded"],
        default: "pending"
    },

    transactionId: {
        type: String
    },

    paidAt: {
        type: Date
    }

}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);