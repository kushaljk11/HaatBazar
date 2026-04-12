import express from "express";
import { toggleWishlist, getWishlist, checkWishlistStatus, removeFromWishlist } from "../controller/wishlist.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/toggle/:postId", authMiddleware, toggleWishlist);

router.get("/", authMiddleware, getWishlist);

router.get("/check/:postId", authMiddleware, checkWishlistStatus);

router.delete("/:postId", authMiddleware, removeFromWishlist);

export default router;