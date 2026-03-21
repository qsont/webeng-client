import axios from "axios";
import { create } from "zustand";

const API_URL = import.meta.env.VITE_API;

const useOrderStore = create((set) => ({
  orders: [],
  selectedOrder: null,
  isLoading: false,
  isDetailLoading: false,
  error: null,
  detailError: null,

  fetchMyOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/orders", {
        baseURL: API_URL,
        withCredentials: true,
      });

      set({
        orders: response?.data?.orders ?? [],
        isLoading: false,
      });

      return response?.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error?.response?.data?.message ?? error.message,
      });
      return error?.response?.data ?? { success: false, message: "Failed to fetch orders." };
    }
  },

  fetchMyOrderById: async (orderId) => {
    set({ isDetailLoading: true, detailError: null });
    try {
      const response = await axios.get(`/orders/${orderId}`, {
        baseURL: API_URL,
        withCredentials: true,
      });

      set({
        selectedOrder: response?.data?.order ?? null,
        isDetailLoading: false,
      });

      return response?.data;
    } catch (error) {
      set({
        selectedOrder: null,
        isDetailLoading: false,
        detailError: error?.response?.data?.message ?? error.message,
      });
      return error?.response?.data ?? { success: false, message: "Failed to fetch order details." };
    }
  },

  clearSelectedOrder: () => set({ selectedOrder: null, detailError: null }),
}));

export default useOrderStore;
