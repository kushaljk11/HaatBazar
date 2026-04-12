import Booking from "../model/Booking.js";
import Payment from "../model/payment.js";
import User from "../model/user.model.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      userId,
      productId,
      quantity,
      totalPrice,
      bookingMode,
      paymentMethod,
    } = req.body;
    const booking = new Booking({
      buyerId: userId,
      postId: productId,
      quantity,
      totalPrice,
      bookingMode,
      paymentMethod,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking details by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("buyerId", "name email")
      .populate("postId", "title price");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings for a user
export const getBookingsByUserId = async (req, res) => {
  try {
    const bookings = await Booking.find({ buyerId: req.params.userId })
      .populate("buyerId", "name email")
      .populate("postId", "title price");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "cancelled";
    booking.paymentStatus = "refunded";
    await booking.save();

    const wasPaid = booking.paymentStatus === "paid";
    // If the booking was paid, create a refund payment record
    if (booking.paymentStatus === "paid") {
      const refundPayment = new Payment({
        paymentId: "PMT" + Date.now() + Math.floor(Math.random() * 1000),
        bookingId: booking._id,
        userId: booking.buyerId,
        amount: booking.totalPrice,
        method: booking.paymentMethod,
        status: "refunded",
        transactionId: "REF" + Date.now() + Math.floor(Math.random() * 1000),
        paidAt: new Date(),
      });
      await refundPayment.save();
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings (admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("buyerId", "name email")
      .populate("postId", "title price");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
