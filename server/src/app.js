import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import userOrderRouter from "./routes/userOrderRoutes.js";
import transactionRouter from "./routes/transactionRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import { requireAdmin } from "./middleware/adminMiddleware.js";

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Expires", "Pragma"],
        credentials: true
    })
);

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', userOrderRouter);
app.use('/api/admin/products', requireAdmin, productRouter);
app.use('/api/admin/orders', requireAdmin, orderRouter);
app.use('/api/admin/transactions', requireAdmin, transactionRouter);
export default app;