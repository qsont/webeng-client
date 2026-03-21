import Product from "../model/Product.js";
import Order from "../model/Order.js";
import Transaction from "../model/Transaction.js";
import User from "../model/User.js";

const getUserByToken = async (email) => {
  return User.findOne({ email }).populate("cartItems.product");
};

export const getCart = async (req, res) => {
  try {
    const user = await getUserByToken(req.user?.email);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({ success: true, cartItems: user.cartItems ?? [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required." });
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be a positive integer." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const user = await User.findOne({ email: req.user?.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const existingItem = user.cartItems.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += parsedQuantity;
    } else {
      user.cartItems.push({ product: productId, quantity: parsedQuantity });
    }

    await user.save();
    const updatedUser = await getUserByToken(req.user?.email);

    return res.status(200).json({
      success: true,
      message: "Item added to cart.",
      cartItems: updatedUser?.cartItems ?? [],
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be a positive integer." });
    }

    const user = await User.findOne({ email: req.user?.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const cartItem = user.cartItems.find((item) => item.product.toString() === productId);
    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Cart item not found." });
    }

    cartItem.quantity = parsedQuantity;
    await user.save();

    const updatedUser = await getUserByToken(req.user?.email);
    return res.status(200).json({
      success: true,
      message: "Cart item updated.",
      cartItems: updatedUser?.cartItems ?? [],
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findOne({ email: req.user?.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
    await user.save();

    const updatedUser = await getUserByToken(req.user?.email);
    return res.status(200).json({
      success: true,
      message: "Cart item removed.",
      cartItems: updatedUser?.cartItems ?? [],
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user?.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.cartItems = [];
    await user.save();

    return res.status(200).json({ success: true, message: "Cart cleared.", cartItems: [] });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const checkoutCart = async (req, res) => {
  try {
    const user = await getUserByToken(req.user?.email);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (!user.cartItems?.length) {
      return res.status(400).json({ success: false, message: "Your cart is empty." });
    }

    const unavailableItems = [];
    for (const cartItem of user.cartItems) {
      const product = cartItem.product;

      if (!product || !product._id) {
        unavailableItems.push({
          productId: cartItem.product,
          reason: "Product no longer exists.",
        });
        continue;
      }

      if (Number(product.stock) < Number(cartItem.quantity)) {
        unavailableItems.push({
          productId: product._id,
          title: product.title,
          requested: Number(cartItem.quantity),
          available: Number(product.stock),
        });
      }
    }

    if (unavailableItems.length) {
      return res.status(400).json({
        success: false,
        message: "Some items are out of stock or unavailable.",
        unavailableItems,
      });
    }

    const orderItems = user.cartItems.map((cartItem) => ({
      productId: cartItem.product._id,
      quantity: Number(cartItem.quantity),
      priceAtPurchase: Number(cartItem.product.price),
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + Number(item.priceAtPurchase) * Number(item.quantity),
      0
    );

    for (const cartItem of user.cartItems) {
      const product = await Product.findById(cartItem.product._id);
      product.stock = Number(product.stock) - Number(cartItem.quantity);
      await product.save();
    }

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      totalAmount,
      status: "Pending",
      paymentStatus: "Unpaid",
    });

    await Transaction.create({
      orderId: order._id,
      amountReceived: totalAmount,
      paymentStatus: "Pending",
      isCompleted: false,
      remittanceDate: null,
    });

    user.cartItems = [];
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Checkout successful. Thank you for your order!",
      order,
      cartItems: [],
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};