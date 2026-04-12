import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getMyPayments, payForOrder } from "../controller/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.get("/payments/my", authMiddleware, getMyPayments);
paymentRouter.post("/payments/order/:orderId/pay", authMiddleware, payForOrder);

export default paymentRouter;
