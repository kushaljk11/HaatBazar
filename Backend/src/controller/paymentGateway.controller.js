import axios from "axios";
import Transaction from "../model/transaction.js";
import Order from "../model/order.js";
import Payment from "../model/payment.js";
import Booking from "../model/booking.js";
import Post from "../model/post.js";
import { generateHmacSha256Hash } from "../utils/paymentGateway.helper.js";

const getMissingEnv = (keys) => keys.filter((key) => !process.env[key]);

const normalizeEnvValue = (value) => {
  if (!value) {
    return "";
  }
  return String(value).trim().replace(/^['\"]|['\"]$/g, "");
};

const getKhaltiSecretKey = () =>
  normalizeEnvValue(process.env.KHALTI_SECRET_KEY).replace(/^Key\s+/i, "");

const makeCode = (prefix) =>
  `${prefix}-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

const createOrderFromTransaction = async (transaction, gateway) => {
  const post = await Post.findById(transaction.postId);
  if (!post) {
    throw new Error("Post not found for this transaction");
  }

  const qty = Number(transaction.quantity || 0);
  if (!qty || qty < 1) {
    throw new Error("Invalid transaction quantity");
  }

  const availableQty = Number(post.quantity || 0);
  if (qty > availableQty) {
    throw new Error("Requested quantity is not available");
  }

  const unitPrice = Number(post.price || 0);
  const totalPrice = unitPrice * qty;

  const booking = await Booking.create({
    buyerId: transaction.buyerId,
    bookingId: makeCode("BK"),
    postId: transaction.postId,
    quantity: qty,
    totalPrice,
    bookingMode: "instant_buy",
    paymentMethod: "online",
    deliveryAddress: transaction.deliveryAddress || "",
    status: "confirmed",
    paymentStatus: "paid",
  });

  const payment = await Payment.create({
    paymentId: makeCode("PMT"),
    bookingId: booking._id,
    userId: transaction.buyerId,
    amount: totalPrice,
    method: gateway,
    status: "success",
    transactionId: transaction.product_id,
    paidAt: new Date(),
  });

  await Order.create({
    orderId: transaction.product_id,
    buyerId: transaction.buyerId,
    postId: transaction.postId,
    bookingId: booking._id,
    paymentId: payment._id,
    quantity: qty,
    unitPrice,
    totalPrice,
    paymentMethod: gateway,
    paymentStatus: "paid",
    orderStatus: "placed",
    deliveryAddress: transaction.deliveryAddress || "",
  });

  post.quantity = Math.max(availableQty - qty, 0);
  post.status = post.quantity === 0 ? "Sold Out" : "Available";
  await post.save();
};

const handleOrderSyncFromTransaction = async (transaction, gatewayStatus) => {
  const existingOrder = await Order.findOne({ orderId: transaction.product_id });

  if (existingOrder) {
    await syncOrderPaymentState({
      productId: transaction.product_id,
      gateway: transaction.payment_gateway,
      gatewayStatus,
    });
    return;
  }

  if (gatewayStatus !== "COMPLETED") {
    return;
  }

  if (!transaction.buyerId || !transaction.postId) {
    return;
  }

  await createOrderFromTransaction(transaction, transaction.payment_gateway);
};

const syncOrderPaymentState = async ({ productId, gateway, gatewayStatus }) => {
  const order = await Order.findOne({ orderId: productId });
  if (!order) {
    return;
  }

  const isCompleted = gatewayStatus === "COMPLETED";
  const orderPaymentStatus = isCompleted ? "paid" : "failed";
  order.paymentStatus = orderPaymentStatus;
  order.paymentMethod = gateway;
  await order.save();

  if (order.bookingId) {
    await Booking.findByIdAndUpdate(order.bookingId, {
      paymentStatus: isCompleted ? "paid" : "unpaid",
      paymentMethod: "online",
    });
  }

  let payment = order.paymentId ? await Payment.findById(order.paymentId) : null;
  if (!payment) {
    payment = await Payment.create({
      paymentId: makeCode("PMT"),
      bookingId: order.bookingId,
      userId: order.buyerId,
      amount: order.totalPrice,
      method: gateway,
      status: isCompleted ? "success" : "failed",
      transactionId: isCompleted ? makeCode("TXN") : "",
      paidAt: isCompleted ? new Date() : undefined,
    });

    order.paymentId = payment._id;
    await order.save();
    return;
  }

  payment.method = gateway;
  payment.status = isCompleted ? "success" : "failed";
  payment.transactionId = isCompleted ? makeCode("TXN") : payment.transactionId;
  payment.paidAt = isCompleted ? new Date() : payment.paidAt;
  await payment.save();
};

export const initiatePayment = async (req, res) => {
  const {
    amount,
    productId,
    paymentGateway,
    customerName,
    customerEmail,
    customerPhone,
    productName,
    postId,
    quantity,
    deliveryAddress,
  } = req.body;

  if (!paymentGateway) {
    return res.status(400).json({ message: "Payment gateway is required" });
  }

  const normalizedGateway = String(paymentGateway).trim().toLowerCase();
  if (!["esewa", "khalti"].includes(normalizedGateway)) {
    return res.status(400).json({ message: "Invalid payment gateway. Use esewa or khalti" });
  }

  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ message: "Amount must be a valid number greater than 0" });
  }

  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }

  try {
    const transactionData = {
      customerDetails: {
        name: customerName || req.user?.name || "Customer",
        email: customerEmail || "customer@example.com",
        phone: customerPhone || "9800000000",
      },
      product_name: productName || "Order Payment",
      product_id: productId,
      amount: numericAmount,
      payment_gateway: normalizedGateway,
      status: "PENDING",
      buyerId: req.user?.id,
      postId: postId || undefined,
      quantity: quantity ? Number(quantity) : undefined,
      deliveryAddress: deliveryAddress || "",
    };

    await Transaction.findOneAndUpdate(
      { product_id: productId },
      { $set: transactionData },
      { upsert: true, new: true },
    );

    if (normalizedGateway === "esewa") {
      const missingEsewaEnv = getMissingEnv([
        "SUCCESS_URL",
        "FAILURE_URL",
        "ESEWA_MERCHANT_ID",
        "ESEWA_SECRET",
        "ESEWA_PAYMENT_URL",
      ]);

      if (missingEsewaEnv.length) {
        return res.status(400).json({
          message: `Missing eSewa configuration: ${missingEsewaEnv.join(", ")}`,
        });
      }

      const paymentData = {
        amount: numericAmount,
        failure_url: process.env.FAILURE_URL,
        product_delivery_charge: "0",
        product_service_charge: "0",
        product_code: process.env.ESEWA_MERCHANT_ID,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        success_url: process.env.SUCCESS_URL,
        tax_amount: "0",
        total_amount: numericAmount,
        transaction_uuid: productId,
      };

      const signatureString = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
      const signature = generateHmacSha256Hash(signatureString, process.env.ESEWA_SECRET);

      return res.json({
        gateway: "esewa",
        url: process.env.ESEWA_PAYMENT_URL,
        formData: { ...paymentData, signature },
      });
    }

    const missingKhaltiEnv = getMissingEnv([
      "SUCCESS_URL",
      "KHALTI_PAYMENT_URL",
      "KHALTI_VERIFICATION_URL",
      "KHALTI_SECRET_KEY",
    ]);

    if (missingKhaltiEnv.length) {
      return res.status(400).json({
        message: `Missing Khalti configuration: ${missingKhaltiEnv.join(", ")}`,
      });
    }

    const khaltiSecret = getKhaltiSecretKey();
    if (!khaltiSecret) {
      return res.status(400).json({ message: "KHALTI_SECRET_KEY is not configured" });
    }

    const response = await axios.post(
      process.env.KHALTI_PAYMENT_URL,
      {
        return_url: process.env.SUCCESS_URL,
        website_url: process.env.WEBSITE_URL || "http://localhost:5173",
        amount: Math.round(numericAmount * 100),
        purchase_order_id: productId,
        purchase_order_name: productName || "Order Payment",
        customer_info: {
          name: customerName || "Customer",
          email: customerEmail || "customer@example.com",
          phone: customerPhone || "9800000000",
        },
      },
      {
        headers: {
          Authorization: `Key ${khaltiSecret}`,
          "Content-Type": "application/json",
        },
      },
    );

    return res.json({
      gateway: "khalti",
      url: response?.data?.payment_url,
      pidx: response?.data?.pidx,
    });
  } catch (error) {
    return res.status(502).json({
      message: "Payment initiation failed",
      error: error.response?.data || error.message,
    });
  }
};

export const paymentStatus = async (req, res) => {
  const { product_id, pidx, status } = req.body;

  try {
    const transaction = await Transaction.findOne({ product_id });
    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    if (status === "FAILED") {
      transaction.status = "FAILED";
      await transaction.save();
      await handleOrderSyncFromTransaction(transaction, "FAILED");
      return res.status(200).json({
        message: "Transaction status updated to FAILED",
        status: "FAILED",
      });
    }

    if (transaction.payment_gateway === "esewa") {
      const response = await axios.get(process.env.ESEWA_PAYMENT_STATUS_CHECK_URL, {
        params: {
          product_code: process.env.ESEWA_MERCHANT_ID,
          total_amount: transaction.amount,
          transaction_uuid: transaction.product_id,
        },
      });

      const completed = response?.data?.status === "COMPLETE";
      transaction.status = completed ? "COMPLETED" : "FAILED";
      await transaction.save();

      await handleOrderSyncFromTransaction(transaction, transaction.status);

      return res.status(200).json({
        message: "Transaction status updated successfully",
        status: transaction.status,
      });
    }

    const response = await axios.post(
      process.env.KHALTI_VERIFICATION_URL,
      { pidx },
      {
        headers: {
          Authorization: `Key ${getKhaltiSecretKey()}`,
          "Content-Type": "application/json",
        },
      },
    );

    const completed = response?.data?.status === "Completed";
    transaction.status = completed ? "COMPLETED" : "FAILED";
    await transaction.save();

    await handleOrderSyncFromTransaction(transaction, transaction.status);

    return res.status(200).json({
      message: "Transaction status updated successfully",
      status: transaction.status,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while checking payment status",
      error: error.response?.data || error.message,
    });
  }
};
