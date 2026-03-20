import Order from "../model/Order.js";

export const getOrders = async (_req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.productId", "title category")
      .sort({ createdAt: -1 });

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
