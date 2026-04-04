import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/user.route.js";

dotenv.config();

const app = express();
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



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
