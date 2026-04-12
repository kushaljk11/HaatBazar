import {createBooking, getBookingsByUserId, cancelBooking, getAllBookings, getBookingById, updateBookingStatus} from "../controller/booking.controller.js";
import express from "express";

const BookingRouter = express.Router();

BookingRouter.post("/bookings", createBooking);
BookingRouter.get("/allbookings", getAllBookings);
BookingRouter.get("/bookings/user/:userId", getBookingsByUserId);
BookingRouter.get("/bookings/:id", getBookingById);
BookingRouter.post("/bookings/:id/cancel", cancelBooking);
BookingRouter.put("/bookings/:id/status", updateBookingStatus);

export default BookingRouter;