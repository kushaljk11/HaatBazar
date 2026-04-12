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
import Chatrouter from "./routes/chat.route.js";
import { initSocket } from "./lib/socket.js";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const DEFAULT_PORT = Number(process.env.PORT || 5000);
const allowAllOrigins = process.env.CORS_ALLOW_ALL === "true";
const isolateCorsDebug = process.env.ISOLATE_CORS_DEBUG === "true";

const normalizeOrigin = (value) => String(value || "").trim().replace(/\/$/, "");
const isVercelDeploymentOrigin = (origin) => /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://haatbazar.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
]
  .map(normalizeOrigin)
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // allow tools like Postman or server-to-server calls
    if (!origin) {
      return callback(null, true);
    }

    if (allowAllOrigins || isolateCorsDebug) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);
    if (allowedOrigins.includes(normalizedOrigin) || isVercelDeploymentOrigin(normalizedOrigin)) {
      return callback(null, true);
    }

    console.log("Blocked CORS origin:", origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// MUST be before routes
app.use(cors(corsOptions));
// Express 5-safe equivalent of app.options("*", cors(corsOptions))
app.options(/.*/, cors(corsOptions));
app.options("/api/chat", cors(corsOptions));
app.use(express.json());
const MONGO_URI = process.env.MONGO_URI;

if (!isolateCorsDebug) {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
} else {
  console.log("ISOLATE_CORS_DEBUG=true -> Skipping MongoDB connection");
}

app.get("/", (req, res) => {
  res.send("API is running...");
});

if (!isolateCorsDebug) {
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
}
app.use("/api", Chatrouter);

if (!isolateCorsDebug) {
  initSocket(httpServer);
} else {
  console.log("ISOLATE_CORS_DEBUG=true -> Skipping Socket.IO initialization");
}

let currentPort = DEFAULT_PORT;

const startServer = (port) => {
  currentPort = port;
  httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

httpServer.on("error", (error) => {
  if (error?.code === "EADDRINUSE") {
    const fallbackPort = currentPort + 1;
    console.warn(`Port ${currentPort} is in use. Retrying on port ${fallbackPort}...`);
    startServer(fallbackPort);
    return;
  }

  console.error("Server startup error:", error);
});

startServer(DEFAULT_PORT);
