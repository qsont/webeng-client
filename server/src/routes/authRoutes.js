import express from "express"
import { checkAuth, login, logout, register } from "../controller/authController.js";

const authRouter = express.Router();

authRouter.get("/check-auth", checkAuth);
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.delete("/logout", logout);

export default authRouter;