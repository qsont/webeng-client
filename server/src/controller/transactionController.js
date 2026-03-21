import Transaction from "../model/Transaction.js";

export const getTransactions = async (req, res) => {
  try {
    const {
      paymentStatus,
      isCompleted,
      orderId,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filters = {};

    if (paymentStatus) {
      if (paymentStatus === "Completed") {
        filters.$or = [{ paymentStatus: "Completed" }, { isCompleted: true }];
      } else {
        filters.paymentStatus = paymentStatus;
      }
    }

    if (isCompleted !== undefined) {
      filters.isCompleted = String(isCompleted).toLowerCase() === "true";
    }

    if (orderId && String(orderId).trim()) {
      filters.orderId = String(orderId).trim();
    }

    if (search && String(search).trim() && !filters.orderId) {
      const searchText = String(search).trim();
      if (searchText && searchText.length >= 6) {
        filters.$expr = {
          $regexMatch: {
            input: { $toString: "$orderId" },
            regex: searchText,
            options: "i",
          },
        };
      }
    }

    const allowedSortFields = ["createdAt", "updatedAt", "amountReceived", "paymentStatus", "remittanceDate"];
    const selectedSortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const selectedSortOrder = sortOrder === "asc" ? 1 : -1;

    const transactions = await Transaction.find(filters)
      .populate({
        path: "orderId",
        select: "totalAmount status paymentStatus user",
      })
      .sort({ [selectedSortField]: selectedSortOrder });

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
    const { orderId, amountReceived, isCompleted, paymentStatus, remittanceDate } = req.body;

    if (!orderId || amountReceived === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const transaction = await Transaction.create({
      orderId,
      amountReceived,
      isCompleted,
      paymentStatus,
      remittanceDate,
    });
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
