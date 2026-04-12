import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }

}, { timestamps: true });

wishlistSchema.index({ userId: 1, postId: 1 }, { unique: true });

export default mongoose.model("Wishlist", wishlistSchema);