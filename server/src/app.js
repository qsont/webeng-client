import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";

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
export default app;