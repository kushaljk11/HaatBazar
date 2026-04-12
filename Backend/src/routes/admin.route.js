import express from "express";
import { adminonly, authMiddleware } from "../middleware/authMiddleware.js";
import {
  getAdminBookings,
  getAdminDashboard,
  getAdminOrders,
  getAdminPayments,
  updateAdminUser,
} from "../controller/admin.controller.js";

const adminRouter = express.Router();

adminRouter.get("/admin/dashboard", authMiddleware, adminonly, getAdminDashboard);
adminRouter.get("/admin/bookings", authMiddleware, adminonly, getAdminBookings);
adminRouter.get("/admin/orders", authMiddleware, adminonly, getAdminOrders);
adminRouter.get("/admin/payments", authMiddleware, adminonly, getAdminPayments);
adminRouter.put("/admin/users/:id", authMiddleware, adminonly, updateAdminUser);

export default adminRouter;
