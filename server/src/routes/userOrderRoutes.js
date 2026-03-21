import express from "express";
import { getMyOrderById, getMyOrders } from "../controller/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const userOrderRouter = express.Router();

userOrderRouter.use(requireAuth);
userOrderRouter.get("/", getMyOrders);
userOrderRouter.get("/:id", getMyOrderById);

export default userOrderRouter;
