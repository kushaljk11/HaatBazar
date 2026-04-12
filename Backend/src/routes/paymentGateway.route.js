import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  initiatePayment,
  paymentStatus,
} from "../controller/paymentGateway.controller.js";

const paymentGatewayRouter = express.Router();

paymentGatewayRouter.post("/initiate-payment", authMiddleware, initiatePayment);
paymentGatewayRouter.post("/payment-status", authMiddleware, paymentStatus);

export default paymentGatewayRouter;
