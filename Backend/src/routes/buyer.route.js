import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addToCart,
  clearCart,
  getBuyerDashboard,
  getBuyerMeta,
  getBuyerSettings,
  getCart,
  getMarketplaceProducts,
  getOrderById,
  getOrderTimeline,
  getSavedPosts,
  removeCartItem,
  removeSavedPost,
  updateBuyerSettings,
  updateCartItemQuantity,
} from "../controller/buyer.controller.js";

const buyerRouter = express.Router();

buyerRouter.use(authMiddleware);

buyerRouter.get("/dashboard", getBuyerDashboard);
buyerRouter.get("/marketplace", getMarketplaceProducts);
buyerRouter.get("/meta", getBuyerMeta);

buyerRouter.get("/orders", getOrderTimeline);
buyerRouter.get("/orders/:orderId", getOrderById);

buyerRouter.get("/saved-posts", getSavedPosts);
buyerRouter.delete("/saved-posts/:savedPostId", removeSavedPost);

buyerRouter.get("/cart", getCart);
buyerRouter.post("/cart", addToCart);
buyerRouter.patch("/cart/:itemId", updateCartItemQuantity);
buyerRouter.delete("/cart/:itemId", removeCartItem);
buyerRouter.delete("/cart", clearCart);

buyerRouter.get("/settings", getBuyerSettings);
buyerRouter.put("/settings", updateBuyerSettings);

export default buyerRouter;
