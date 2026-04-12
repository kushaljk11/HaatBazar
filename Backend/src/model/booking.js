import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    bookingId: {
        type: String,
        required: true,
        unique: true
    },

    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    totalPrice: {
        type: Number,
        required: true
    },

    // ⭐ NEW: Booking Mode
    bookingMode: {
        type: String,
        enum: [
            "instant_buy",
            "reserve_pickup",
            "cash_on_delivery",
            "delivery_schedule",
            "pre_order"
        ],
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "delivered"],
        default: "pending"
    },

    paymentStatus: {
        type: String,
        enum: ["unpaid", "paid", "refunded"],
        default: "unpaid"
    },

    paymentMethod: {
        type: String,
        enum: ["cod", "online", "wallet"],
        default: "cod"
    },

    pickupLocation: {
        type: String
    },

    pickupTime: {
        type: Date
    },

    timeInterval: {
        type: String
    },

    deliveryAddress: {
        type: String
    },

    deliveryTime: {
        type: Date
    }

}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);