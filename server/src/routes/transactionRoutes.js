import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactions,
  updateTransaction,
} from "../controller/transactionController.js";

const transactionRouter = express.Router();

transactionRouter.get("/", getTransactions);
transactionRouter.get("/:id", getTransactionById);
transactionRouter.post("/", createTransaction);
transactionRouter.put("/:id", updateTransaction);
transactionRouter.delete("/:id", deleteTransaction);

export default transactionRouter;
