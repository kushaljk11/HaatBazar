import mongoose from "mongoose";
import Booking from "../model/booking.js";
import Order from "../model/order.js";
import Payment from "../model/payment.js";
import Post from "../model/post.js";

const makeCode = (prefix) =>
  `${prefix}-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

const normalizeBookingMethod = (method) => {
  if (["wallet", "cod"].includes(method)) {
    return method;
  }

  if (["esewa", "khalti", "bank_transfer", "online"].includes(method)) {
    return "online";
  }

  return "cod";
};

export const createOrder = async (req, res) => {
  try {
    const buyerId = req.user?.id;
    const {
      postId,
      quantity,
      paymentMethod = "cod",
      deliveryAddress = "",
      bookingMode = "instant_buy",
    } = req.body;

    if (!buyerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Valid postId is required" });
    }

    const parsedQty = Number(quantity);
    if (!parsedQty || parsedQty < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const post = await Post.findById(postId).populate("user", "name email");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const availableQty = Number(post.quantity || 0);
    if (parsedQty > availableQty) {
      return res.status(400).json({ message: "Requested quantity is not available" });
    }

    const unitPrice = Number(post.price || 0);
    const totalPrice = unitPrice * parsedQty;

    const booking = await Booking.create({
      buyerId,
      bookingId: makeCode("BK"),
      postId,
      quantity: parsedQty,
      totalPrice,
      bookingMode,
      paymentMethod: normalizeBookingMethod(paymentMethod),
      deliveryAddress,
      status: "confirmed",
      paymentStatus: paymentMethod === "cod" ? "unpaid" : "paid",
    });

    const payment = await Payment.create({
      paymentId: makeCode("PMT"),
      bookingId: booking._id,
      userId: buyerId,
      amount: totalPrice,
      method: paymentMethod,
      status: paymentMethod === "cod" ? "pending" : "success",
      transactionId: paymentMethod === "cod" ? "" : makeCode("TXN"),
      paidAt: paymentMethod === "cod" ? undefined : new Date(),
    });

    const order = await Order.create({
      orderId: makeCode("ORD"),
      buyerId,
      postId,
      bookingId: booking._id,
      paymentId: payment._id,
      quantity: parsedQty,
      unitPrice,
      totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "unpaid" : "paid",
      orderStatus: "placed",
      deliveryAddress,
    });

    const updatedQty = Math.max(availableQty - parsedQty, 0);
    post.quantity = updatedQty;
    post.status = updatedQty === 0 ? "Sold Out" : "Available";
    await post.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("buyerId", "name email")
      .populate({ path: "postId", populate: { path: "user", select: "name email" } })
      .populate("bookingId")
      .populate("paymentId");

    return res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const buyerId = req.user?.id;
    if (!buyerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ buyerId })
      .sort({ createdAt: -1 })
      .populate({ path: "postId", populate: { path: "user", select: "name email" } })
      .populate("paymentId")
      .populate("bookingId");

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const buyerId = req.user?.id;
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate({ path: "postId", populate: { path: "user", select: "name email" } })
      .populate("paymentId")
      .populate("bookingId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(order.buyerId) !== String(buyerId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const buyerId = req.user?.id;
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(order.buyerId) !== String(buyerId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (["delivered", "cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({ message: "This order cannot be cancelled" });
    }

    order.orderStatus = "cancelled";
    order.paymentStatus = order.paymentStatus === "paid" ? "refunded" : order.paymentStatus;
    await order.save();

    await Booking.findByIdAndUpdate(order.bookingId, {
      status: "cancelled",
      paymentStatus: order.paymentStatus === "refunded" ? "refunded" : "unpaid",
    });

    if (order.paymentId) {
      await Payment.findByIdAndUpdate(order.paymentId, {
        status: order.paymentStatus === "refunded" ? "refunded" : "failed",
      });
    }

    const post = await Post.findById(order.postId);
    if (post) {
      post.quantity = Number(post.quantity || 0) + Number(order.quantity || 0);
      post.status = "Available";
      await post.save();
    }

    return res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrdersByFarmerId = async (req, res) => {
  try {
    const farmerId = req.user?.id;
    if (String(farmerId) !== String(req.params.farmerId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("buyerId", "name email")
      .populate({ path: "postId", populate: { path: "user", select: "name email" } })
      .populate("paymentId")
      .populate("bookingId");

    const farmerOrders = orders.filter(
      (item) => String(item?.postId?.user?._id || item?.postId?.user) === String(farmerId),
    );

    return res.json(farmerOrders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const acceptOrderByFarmer = async (req, res) => {
  try {
    const farmerId = req.user?.id;
    const { id } = req.params;

    const order = await Order.findById(id).populate({ path: "postId", select: "user" });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const postOwnerId = order?.postId?.user?._id || order?.postId?.user;
    if (String(postOwnerId) !== String(farmerId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (order.orderStatus !== "placed") {
      return res.status(400).json({ message: "Only placed orders can be accepted" });
    }

    order.orderStatus = "confirmed";
    await order.save();

    if (order.bookingId) {
      await Booking.findByIdAndUpdate(order.bookingId, { status: "confirmed" });
    }

    const populated = await Order.findById(order._id)
      .populate("buyerId", "name email")
      .populate({ path: "postId", populate: { path: "user", select: "name email" } })
      .populate("paymentId")
      .populate("bookingId");

    return res.json({ message: "Order accepted successfully", order: populated });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
