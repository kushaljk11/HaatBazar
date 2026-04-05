import User from "../model/user.model.js";
import { registerUser, login, getAllUsers, getUserById, updateUser, deleteUser, countUsers} from "../controller/user.controller.js";
import { authMiddleware, adminonly, adminOrSelf } from "../middleware/authMiddleware.js";
import buyerRouter from "./buyer.route.js";
import farmerRouter from "./farmer.route.js";
import adminRouter from "./admin.route.js";
import express from "express";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/users", authMiddleware, adminonly, getAllUsers);
router.get("/user/count", authMiddleware, adminonly, countUsers);
router.get("/user/:id", authMiddleware, adminOrSelf, getUserById);
router.put("/user/update/:id", authMiddleware, adminOrSelf, updateUser);
router.delete("/user/delete/:id", authMiddleware, adminOrSelf, deleteUser);

router.use("/buyer", buyerRouter);
router.use("/farmer", farmerRouter);
router.use("/admin", adminRouter);

export default router;