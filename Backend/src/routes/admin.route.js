import express from "express";
import { authMiddleware, adminonly } from "../middleware/authMiddleware.js";
import {
  deleteAdminPost,
  getAdminDashboard,
  getAdminPosts,
  getAdminUsers,
  updateAdminPostStatus,
  updateAdminUserStatus,
} from "../controller/admin.controller.js";

const adminRouter = express.Router();

adminRouter.use(authMiddleware, adminonly);

adminRouter.get("/dashboard", getAdminDashboard);

adminRouter.get("/users", getAdminUsers);
adminRouter.patch("/users/:userId/status", updateAdminUserStatus);

adminRouter.get("/posts", getAdminPosts);
adminRouter.patch("/posts/:postId/status", updateAdminPostStatus);
adminRouter.delete("/posts/:postId", deleteAdminPost);

export default adminRouter;
