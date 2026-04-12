import Booking from "../model/booking.js";
import Payment from "../model/payment.js";
import Post from "../model/post.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      productId,
      quantity,
      bookingMode,
      paymentMethod,
      pickupDate,
      timeInterval,
      pickupLocation,
      deliveryAddress,
    } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const parsedQty = Number(quantity);
    if (!parsedQty || parsedQty < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const post = await Post.findById(productId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const availableQty = Number(post.quantity || 0);
    if (parsedQty > availableQty) {
      return res.status(400).json({ message: "Requested quantity exceeds stock" });
    }

    if (post.minimumOrder && parsedQty < Number(post.minimumOrder)) {
      return res.status(400).json({
        message: `Minimum order is ${post.minimumOrder} kg`,
      });
    }

    let pickupTime;
    if (pickupDate) {
      const parsedDate = new Date(pickupDate);
      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid pickupDate" });
      }
      pickupTime = parsedDate;
    }

    const computedTotalPrice = Number(post.price || 0) * parsedQty;

    const booking = new Booking({
      buyerId: userId,
      bookingId: `BK-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      postId: productId,
      quantity: parsedQty,
      totalPrice: computedTotalPrice,
      bookingMode: bookingMode || "reserve_pickup",
      paymentMethod: paymentMethod || "cod",
      pickupTime,
      timeInterval,
      pickupLocation,
      deliveryAddress,
      status: "pending",
      paymentStatus: "unpaid",
    });
    await booking.save();

    post.quantity = Math.max(availableQty - parsedQty, 0);
    post.status = post.quantity === 0 ? "Sold Out" : "Available";
    await post.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("buyerId", "name email")
      .populate({
        path: "postId",
        select: "postTitle price postLocation postImage user",
        populate: { path: "user", select: "name email" },
      });

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Farmer accepts a pending booking request
export const acceptBookingByFarmer = async (req, res) => {
  try {
    const farmerId = req.user?.id;
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("postId", "user postTitle");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const postOwnerId = booking?.postId?.user?._id || booking?.postId?.user;
    if (String(postOwnerId) !== String(farmerId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be accepted" });
    }

    booking.status = "confirmed";
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate("buyerId", "name email")
      .populate({
        path: "postId",
        select: "postTitle price postLocation postImage user",
        populate: { path: "user", select: "name email" },
      });

    return res.json({ message: "Booking accepted successfully", booking: populated });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get booking details by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("buyerId", "name email")
      .populate("postId", "postTitle price postLocation postImage user");
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
    if (String(req.user?.id) !== String(req.params.userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const bookings = await Booking.find({ buyerId: req.params.userId })
      .populate("buyerId", "name email")
      .populate({
        path: "postId",
        select: "postTitle price postLocation postImage user",
        populate: { path: "user", select: "name email" },
      });
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

    if (String(booking.buyerId) !== String(req.user?.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const wasPaid = booking.paymentStatus === "paid";
    booking.status = "cancelled";
    booking.paymentStatus = wasPaid ? "refunded" : "unpaid";
    await booking.save();

    // If the booking was paid, create a refund payment record
    if (wasPaid) {
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
      .populate("postId", "postTitle price postLocation postImage user");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bookings for a farmer by matching booking.postId.user
export const getBookingsByFarmerId = async (req, res) => {
  try {
    if (String(req.user?.id) !== String(req.params.farmerId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const bookings = await Booking.find()
      .populate("buyerId", "name email")
      .populate({
        path: "postId",
        select: "postTitle price postLocation postImage user",
        populate: { path: "user", select: "name email" },
      })
      .sort({ createdAt: -1 });

    const farmerBookings = bookings.filter(
      (item) => String(item?.postId?.user?._id || item?.postId?.user) === String(req.params.farmerId),
    );

    return res.json(farmerBookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
