import Wishlist from "../model/wishlist.js";

export const toggleWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { postId } = req.params;

        if (!userId || !postId) {
            return res.status(400).json({ message: "userId and postId are required" });
        }

        const existing = await Wishlist.findOne({ userId, postId });

        if (existing) {
            await Wishlist.deleteOne({ _id: existing._id });
            return res.json({ message: "Removed from wishlist", saved: false });
        }

        const wishlist = new Wishlist({ userId, postId });
        await wishlist.save();

        res.status(201).json({ message: "Added to wishlist", saved: true });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const wishlist = await Wishlist.find({ userId })
            .populate({
                path: "postId",
                populate: { path: "user", select: "name email" },
            });

        res.json(wishlist);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const checkWishlistStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { postId } = req.params;

        if (!userId || !postId) {
            return res.status(400).json({ message: "userId and postId are required" });
        }

        const exists = await Wishlist.exists({ userId, postId });
        res.json({ saved: !!exists });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { postId } = req.params;

        if (!userId || !postId) {
            return res.status(400).json({ message: "userId and postId are required" });
        }

        await Wishlist.deleteOne({ userId, postId });
        res.json({ message: "Removed from wishlist" });
    }   
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};