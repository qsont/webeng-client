import Order from "../model/Order.js";
import Transaction from "../model/Transaction.js";
import User from "../model/User.js";
import mongoose from "mongoose";

const getUserIdFromToken = async (email) => {
  const user = await User.findOne({ email }).select("_id");
  return user?._id;
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = await getUserIdFromToken(req.user?.email);
    if (!userId) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const orders = await Order.find({ user: userId })
      .populate("items.productId", "title image price category")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrderById = async (req, res) => {
  try {
    const userId = await getUserIdFromToken(req.user?.email);
    if (!userId) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const order = await Order.findOne({ _id: req.params.id, user: userId }).populate(
      "items.productId",
      "title image price category"
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { status, paymentStatus, search, sortBy = "createdAt", sortOrder = "desc" } = req.query;

    const filters = {};

    if (status) {
      filters.status = status;
    }

    if (paymentStatus) {
      filters.paymentStatus = paymentStatus;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      const userMatches = await User.find({
        $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }],
      }).select("_id");

      const userIds = userMatches.map((user) => user._id);
      const searchFilters = [];

      if (userIds.length) {
        searchFilters.push({ user: { $in: userIds } });
      }

      if (mongoose.Types.ObjectId.isValid(search)) {
        searchFilters.push({ _id: search });
      }

      if (searchFilters.length) {
        filters.$or = searchFilters;
      } else {
        return res.status(200).json({ success: true, orders: [] });
      }
    }

    const allowedSortFields = ["createdAt", "updatedAt", "totalAmount", "status", "paymentStatus"];
    const selectedSortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const selectedSortOrder = sortOrder === "asc" ? 1 : -1;

    const orders = await Order.find(filters)
      .populate("user", "name email")
      .populate("items.productId", "title category")
      .sort({ [selectedSortField]: selectedSortOrder });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.productId", "title category");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { user, items, totalAmount, status, paymentStatus } = req.body;

    if (!user || !items || !Array.isArray(items) || items.length === 0 || totalAmount === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const order = await Order.create({ user, items, totalAmount, status, paymentStatus });
    return res.status(201).json({ success: true, message: "Order created successfully.", order });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    return res.status(200).json({ success: true, message: "Order updated successfully.", order });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    return res.status(200).json({ success: true, message: "Order deleted successfully." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const completeOrderDelivery = async (req, res) => {
  const orderId = req.params.orderId || req.body?.orderId;

  if (!orderId) {
    return res.status(400).json({ success: false, message: "orderId is required." });
  }

  const session = await mongoose.startSession();

  try {
    let updatedOrder = null;
    let updatedTransaction = null;

    await session.withTransaction(async () => {
      const order = await Order.findById(orderId).session(session);
      if (!order) {
        throw new Error("ORDER_NOT_FOUND");
      }

      const transaction = await Transaction.findOne({ orderId: order._id }).session(session);
      if (!transaction) {
        throw new Error("TRANSACTION_NOT_FOUND");
      }

      order.status = "Delivered";
      await order.save({ session });

      transaction.paymentStatus = "Completed";
      transaction.isCompleted = true;
      transaction.remittanceDate = new Date();
      await transaction.save({ session });

      updatedOrder = order;
      updatedTransaction = transaction;
    });

    return res.status(200).json({
      success: true,
      message: "Order marked as Delivered and transaction remittance completed.",
      order: updatedOrder,
      transaction: updatedTransaction,
    });
  } catch (error) {
    if (error.message === "ORDER_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (error.message === "TRANSACTION_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Associated transaction not found." });
    }

    return res.status(400).json({ success: false, message: error.message });
  } finally {
    await session.endSession();
  }
};
