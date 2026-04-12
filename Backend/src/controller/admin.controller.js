import User from "../model/user.model.js";
import Post from "../model/post.js";
import Booking from "../model/booking.js";
import Order from "../model/order.js";
import Payment from "../model/payment.js";

export const getAdminDashboard = async (_req, res) => {
  try {
    const [
      totalUsers,
      totalFarmers,
      totalBuyers,
      totalPosts,
      pendingPosts,
      totalBookings,
      totalOrders,
      totalPayments,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "farmer" }),
      User.countDocuments({ role: "buyer" }),
      Post.countDocuments(),
      Post.countDocuments({ adminApproval: "Pending" }),
      Booking.countDocuments(),
      Order.countDocuments(),
      Payment.countDocuments(),
    ]);

    return res.json({
      totalUsers,
      totalFarmers,
      totalBuyers,
      totalPosts,
      pendingPosts,
      totalBookings,
      totalOrders,
      totalPayments,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAdminBookings = async (_req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate("buyerId", "name email role")
      .populate({
        path: "postId",
        select: "postTitle postLocation price user",
        populate: { path: "user", select: "name email role" },
      });

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAdminOrders = async (_req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("buyerId", "name email role")
      .populate({
        path: "postId",
        select: "postTitle postLocation price user",
        populate: { path: "user", select: "name email role" },
      })
      .populate("paymentId", "paymentId method status amount")
      .populate("bookingId", "bookingId status");

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAdminPayments = async (_req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email role")
      .populate({
        path: "bookingId",
        select: "bookingId buyerId postId",
        populate: [
          { path: "buyerId", select: "name email role" },
          {
            path: "postId",
            select: "postTitle user",
            populate: { path: "user", select: "name email role" },
          },
        ],
      });

    return res.json(payments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    const updates = {};
    if (role && ["admin", "buyer", "farmer"].includes(role)) {
      updates.role = role;
    }
    if (status && ["active", "inactive"].includes(status)) {
      updates.status = status;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid updates provided" });
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User updated", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
