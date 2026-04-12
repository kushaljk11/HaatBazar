import User from "../model/user.model.js";
import { registerUser, login, getAllUsers, getUserById, updateUser, deleteUser, countUsers, changePassword} from "../controller/user.controller.js";
import { authMiddleware, adminonly, adminOrSelf } from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/users", authMiddleware, adminonly, getAllUsers);
router.get("/user/count", authMiddleware, adminonly, countUsers);
router.get("/user/:id", authMiddleware, adminOrSelf, getUserById);
router.put("/user/update/:id", authMiddleware, adminOrSelf, updateUser);
router.put("/user/password/:id", authMiddleware, adminOrSelf, changePassword);
router.delete("/user/delete/:id", authMiddleware, adminOrSelf, deleteUser);

export default router;