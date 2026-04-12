import express from "express";
import upload from "../middleware/upload.js";
import { uploadImage } from "../controller/imageController.js";

const Imagerouter = express.Router();

Imagerouter.post("/upload", upload.single("image"), uploadImage);

export default Imagerouter;