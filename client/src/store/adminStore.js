import axios from "axios";
import { create } from "zustand";

const API_URL = import.meta.env.VITE_API;

const useAdminStore = create((set, get) => ({
  isLoading: false,
  error: null,
  products: [],
  productCategories: [],
  orders: [],
  transactions: [],
  completedTransactions: [],

  clearError: () => set({ error: null }),

  fetchProducts: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = typeof query === "string" ? { category: query } : query;
      const response = await axios.get("/admin/products", {
        baseURL: API_URL,
        withCredentials: true,
        params,
      });
      set({ isLoading: false, products: response?.data?.products ?? [] });
      return response?.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return error?.response?.data ?? { success: false, message: "Network error. Please try again." };
    }
  },

  fetchProductCategories: async () => {
    try {
      const response = await axios.get("/products/categories", {
        baseURL: API_URL,
        withCredentials: true,
      });

      set({ productCategories: response?.data?.categories ?? [] });
      return response?.data;
    } catch (error) {
      return error?.response?.data ?? { success: false, message: "Failed to load product categories." };
    }
  },

  createProduct: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/admin/products", formData, {
        baseURL: API_URL,
        withCredentials: true,
      });
      await get().fetchProducts();
      set({ isLoading: false });
      return response?.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return error?.response?.data ?? { success: false, message: "Network error. Please try again." };
    }
  },

  updateProduct: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/admin/products/${id}`, formData, {
        baseURL: API_URL,
        withCredentials: true,
      });
      await get().fetchProducts();
      set({ isLoading: false });
      return response?.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return error?.response?.data ?? { success: false, message: "Network error. Please try again." };
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`/admin/products/${id}`, {
        baseURL: API_URL,
        withCredentials: true,
      });
      await get().fetchProducts();
      set({ isLoading: false });
      return response?.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return error?.response?.data ?? { success: false, message: "Network error. Please try again." };
    }
  },

  fetchOrders: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/admin/orders", {
        baseURL: API_URL,
        withCredentials: true,
        params: query,
      });
      set({ isLoading: false, orders: response?.data?.orders ?? [] });
      return response?.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return error?.response?.data ?? { success: false, message: "Network error. Please try again." };
    }
  },

  updateOrder: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/admin/orders/${id}`, formData, {
        baseURL: API_URL,
        withCredentials: true,
      });
      await get().fetchOrders();
      set({ isLoading: false });
      return response?.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return error?.response?.data ?? { success: false, message: "Network error. Please try again." };
    }
  },

  completeOrderDelivery: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(
        `/admin/orders/${orderId}/complete-delivery`,
        {},
        {
          baseURL: API_URL,
          withCredentials: true,
        }
      );

      await Promise.all([
        get().fetchOrders(),
        get().fetchTransactions(),
        get().fetchCompletedTransactions(),
      ]);

      set({ isLoading: false });
      return response?.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return error?.response?.data ?? { success: false, message: "Network error. Please try again." };
    }
  },

  deleteOrder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`/admin/orders/${id}`, {
        baseURL: API_URL,
        withCredentials: true,
      });
      await get().fetchOrders();
      set({ isLoading: false });
      return response?.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return error?.response?.data ?? { success: false, message: "Network error. Please try again." };
    }
  },

  fetchTransactions: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/admin/transactions", {
        baseURL: API_URL,
        withCredentials: true,
        params: query,
      });
      set({ isLoading: false, transactions: response?.data?.transactions ?? [] });
      return response?.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return error?.response?.data ?? { success: false, message: "Network error. Please try again." };
    }
  },

  fetchCompletedTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/admin/transactions", {
        baseURL: API_URL,
        withCredentials: true,
        params: { paymentStatus: "Completed" },
      });
      set({ isLoading: false, completedTransactions: response?.data?.transactions ?? [] });
      return response?.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return error?.response?.data ?? { success: false, message: "Network error. Please try again." };
    }
  },

  createTransaction: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/admin/transactions", formData, {
        baseURL: API_URL,
        withCredentials: true,
      });
      await get().fetchTransactions();
      set({ isLoading: false });
      return response?.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return error?.response?.data ?? { success: false, message: "Network error. Please try again." };
    }
  },

  updateTransaction: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/admin/transactions/${id}`, formData, {
        baseURL: API_URL,
        withCredentials: true,
      });
      await get().fetchTransactions();
      set({ isLoading: false });
      return response?.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return error?.response?.data ?? { success: false, message: "Network error. Please try again." };
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`/admin/transactions/${id}`, {
        baseURL: API_URL,
        withCredentials: true,
      });
      await get().fetchTransactions();
      set({ isLoading: false });
      return response?.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return error?.response?.data ?? { success: false, message: "Network error. Please try again." };
    }
  },
}));

export default useAdminStore;
