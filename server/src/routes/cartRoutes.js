import express from "express";
import {
  addToCart,
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
cartRouter.patch("/:productId", updateCartItem);
cartRouter.delete("/:productId", removeCartItem);
cartRouter.delete("/", clearCart);

export default cartRouter;