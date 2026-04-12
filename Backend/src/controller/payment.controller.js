import Payment from "../model/payment.js";
import Order from "../model/order.js";
import Booking from "../model/booking.js";
import Post from "../model/post.js";
import { notifyRole, notifyUser } from "../utils/notification.helper.js";

const makeCode = (prefix) =>
  `${prefix}-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

export const getMyPayments = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "bookingId",
        populate: {
          path: "postId",
          populate: { path: "user", select: "name email" },
        },
      });

    return res.json(payments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const payForOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { orderId } = req.params;
    const { method = "wallet" } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(order.buyerId) !== String(userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Order is already paid" });
    }

    let payment = order.paymentId ? await Payment.findById(order.paymentId) : null;

    if (!payment) {
      payment = await Payment.create({
        paymentId: makeCode("PMT"),
        bookingId: order.bookingId,
        userId,
        amount: order.totalPrice,
        method,
        status: "success",
        transactionId: makeCode("TXN"),
        paidAt: new Date(),
      });
      order.paymentId = payment._id;
    } else {
      payment.method = method;
      payment.status = "success";
      payment.transactionId = makeCode("TXN");
      payment.paidAt = new Date();
      await payment.save();
    }

    order.paymentMethod = method;
    order.paymentStatus = "paid";
    await order.save();

    await Booking.findByIdAndUpdate(order.bookingId, {
      paymentMethod: ["wallet", "cod"].includes(method) ? method : "online",
      paymentStatus: "paid",
    });

    const post = await Post.findById(order.postId).select("postTitle user");

    await notifyRole({
      role: "admin",
      type: "payment_success",
      title: "Payment Received",
      message: `Payment completed for order ${order.orderId}`,
      data: { orderId: order._id, paymentId: payment._id, amount: order.totalPrice },
    });

    if (post?.user) {
      await notifyUser({
        userId: post.user,
        type: "payment_success",
        title: "Payment Received",
        message: `You received payment for ${post.postTitle}`,
        data: { orderId: order._id, paymentId: payment._id, amount: order.totalPrice },
      });
    }

    return res.json({ message: "Payment successful", payment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
