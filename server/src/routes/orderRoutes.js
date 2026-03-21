import express from "express";
import {
  completeOrderDelivery,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.get("/", getOrders);
orderRouter.get("/:id", getOrderById);
orderRouter.patch("/:orderId/complete-delivery", completeOrderDelivery);
orderRouter.put("/:id", updateOrder);
orderRouter.delete("/:id", deleteOrder);

export default orderRouter;
