import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createFarmerPost,
  deleteFarmerPost,
  getFarmerDashboard,
  getFarmerMyPosts,
  getFarmerProfile,
  updateFarmerPost,
  updateFarmerProfile,
} from "../controller/farmer.controller.js";

const farmerRouter = express.Router();

farmerRouter.use(authMiddleware);

farmerRouter.get("/dashboard", getFarmerDashboard);
farmerRouter.get("/profile", getFarmerProfile);
farmerRouter.put("/profile", updateFarmerProfile);

farmerRouter.post("/posts", createFarmerPost);
farmerRouter.get("/posts/me", getFarmerMyPosts);
farmerRouter.put("/posts/:postId", updateFarmerPost);
farmerRouter.delete("/posts/:postId", deleteFarmerPost);

export default farmerRouter;
