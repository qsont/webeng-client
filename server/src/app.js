import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import transactionRouter from "./routes/transactionRoutes.js";
import { requireAdmin } from "./middleware/adminMiddleware.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        // replace origin to import from .env
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Expires", "Pragma"],
        credentials: true
    })
);

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/admin/products', requireAdmin, productRouter);
app.use('/api/admin/orders', requireAdmin, orderRouter);
app.use('/api/admin/transactions', requireAdmin, transactionRouter);
export default app;