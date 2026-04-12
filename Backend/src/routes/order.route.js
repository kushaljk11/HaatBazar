import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  acceptOrderByFarmer,
  cancelOrder,
  createOrder,
  getOrdersByFarmerId,
  getMyOrders,
  getOrderById,
} from "../controller/order.controller.js";

const orderRouter = express.Router();

orderRouter.post("/orders", authMiddleware, createOrder);
orderRouter.get("/orders/my", authMiddleware, getMyOrders);
orderRouter.get("/orders/farmer/:farmerId", authMiddleware, getOrdersByFarmerId);
orderRouter.put("/orders/:id/farmer-accept", authMiddleware, acceptOrderByFarmer);
orderRouter.get("/orders/:id", authMiddleware, getOrderById);
orderRouter.post("/orders/:id/cancel", authMiddleware, cancelOrder);

export default orderRouter; 