import {createBooking, getBookingsByUserId, getBookingsByFarmerId, acceptBookingByFarmer, cancelBooking, getAllBookings, getBookingById, updateBookingStatus} from "../controller/booking.controller.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const BookingRouter = express.Router();

BookingRouter.post("/bookings", authMiddleware, createBooking);
BookingRouter.get("/allbookings", authMiddleware, getAllBookings);
BookingRouter.get("/bookings/user/:userId", authMiddleware, getBookingsByUserId);
BookingRouter.get("/bookings/farmer/:farmerId", authMiddleware, getBookingsByFarmerId);
BookingRouter.put("/bookings/:id/farmer-accept", authMiddleware, acceptBookingByFarmer);
BookingRouter.get("/bookings/:id", authMiddleware, getBookingById);
BookingRouter.post("/bookings/:id/cancel", authMiddleware, cancelBooking);
BookingRouter.put("/bookings/:id/status", authMiddleware, updateBookingStatus);

export default BookingRouter;