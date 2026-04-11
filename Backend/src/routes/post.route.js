import {createPost, getAllPosts, GetPostById, getPostsByUserId, updatePost, deletePost, getMarketplacePosts, getPendingPosts, updatePostApproval, updatePostStatus, searchPosts, getRecentUserLogs} from "../controller/post.controller.js";
import {getPostCount} from "../controller/post.controller.js";
import express from "express";
import {authMiddleware, adminonly, adminOrSelf} from "../middleware/authMiddleware.js";

const postRouter = express.Router();

postRouter.post("/create", authMiddleware, createPost);
postRouter.get("/allposts", authMiddleware, adminonly, getAllPosts);
postRouter.get("/marketplace", authMiddleware, getMarketplacePosts);
postRouter.get("/pendingposts", authMiddleware, adminonly, getPendingPosts);
postRouter.get("/post/:id", authMiddleware, GetPostById);
postRouter.get("/search", authMiddleware, searchPosts);

postRouter.get("/count/:userId", authMiddleware, getPostCount);
postRouter.get("/myposts/:userId", authMiddleware, getPostsByUserId);
postRouter.put("/updatepost/:id", authMiddleware, updatePost);
postRouter.delete("/deletepost/:id", authMiddleware, deletePost);
postRouter.put("/updateapproval/:id", authMiddleware, adminonly, updatePostApproval);
postRouter.put("/updatestatus/:id", authMiddleware, adminonly, updatePostStatus);
postRouter.get("/recentlogs/:userId", authMiddleware, adminOrSelf, getRecentUserLogs);

export default postRouter;