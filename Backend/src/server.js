import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import router from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import BookingRouter from "./routes/booking.route.js";
import wishlistRouter from "./routes/wishlist.route.js";
import orderRouter from "./routes/order.route.js";
import paymentRouter from "./routes/payment.route.js";
import paymentGatewayRouter from "./routes/paymentGateway.route.js";
import adminRouter from "./routes/admin.route.js";
import notificationRouter from "./routes/notification.route.js";
import imageRouter from "./routes/image.route.js";
import chatRouter from "./routes/chat.route.js";
import { initSocket } from "./lib/socket.js";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
}));
app.use(express.json());
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", router);
app.use("/api", postRouter);
app.use("/api", BookingRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api", orderRouter);
app.use("/api", paymentRouter);
app.use("/api/payment", paymentGatewayRouter);
app.use("/api", adminRouter);
app.use("/api", notificationRouter);
app.use("/api/image", imageRouter);
app.use("/api", chatRouter);

initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
