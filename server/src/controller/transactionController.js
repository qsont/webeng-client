import Transaction from "../model/Transaction.js";

export const getTransactions = async (_req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate({
        path: "orderId",
        select: "totalAmount status paymentStatus user",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, transactions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate({
      path: "orderId",
      select: "totalAmount status paymentStatus user",
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found." });
    }

    return res.status(200).json({ success: true, transaction });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { orderId, amountReceived, isCompleted } = req.body;

    if (!orderId || amountReceived === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const transaction = await Transaction.create({ orderId, amountReceived, isCompleted });
    return res.status(201).json({ success: true, message: "Transaction created successfully.", transaction });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found." });
    }

    return res.status(200).json({ success: true, message: "Transaction updated successfully.", transaction });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found." });
    }

    return res.status(200).json({ success: true, message: "Transaction deleted successfully." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
