import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controller/notification.controller.js";

const notificationRouter = express.Router();

notificationRouter.get("/notifications/my", authMiddleware, getMyNotifications);
notificationRouter.put("/notifications/:id/read", authMiddleware, markNotificationRead);
notificationRouter.put("/notifications/read-all", authMiddleware, markAllNotificationsRead);

export default notificationRouter;
