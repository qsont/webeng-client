import express from "express";
import {
  addToCart,
  checkoutCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controller/cartController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const cartRouter = express.Router();

cartRouter.use(requireAuth);

cartRouter.get("/", getCart);
cartRouter.post("/", addToCart);
cartRouter.post("/checkout", checkoutCart);
cartRouter.patch("/:productId", updateCartItem);
cartRouter.delete("/:productId", removeCartItem);
cartRouter.delete("/", clearCart);

export default cartRouter;