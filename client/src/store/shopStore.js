import axios from "axios";
import { create } from "zustand";

const API_URL = import.meta.env.VITE_API;

const useShopStore = create((set) => ({
  products: [],
  categories: [],
  selectedProduct: null,
  isLoading: false,
  error: null,

  fetchProducts: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/products", {
        baseURL: API_URL,
        params: query,
        withCredentials: true,
      });

      set({
        products: response?.data?.products ?? [],
        isLoading: false,
      });

      return response?.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error?.response?.data?.message ?? error.message,
      });

      return error?.response?.data ?? { success: false, message: "Network error. Please try again." };
    }
  },

  fetchCategories: async () => {
    try {
      const response = await axios.get("/products/categories", {
        baseURL: API_URL,
        withCredentials: true,
      });

      set({ categories: response?.data?.categories ?? [] });
      return response?.data;
    } catch (error) {
      return error?.response?.data ?? { success: false, message: "Failed to load categories." };
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null, selectedProduct: null });
    try {
      const response = await axios.get(`/products/${id}`, {
        baseURL: API_URL,
        withCredentials: true,
      });

      set({
        selectedProduct: response?.data?.product ?? null,
        isLoading: false,
      });

      return response?.data;
    } catch (error) {
      set({
        selectedProduct: null,
        isLoading: false,
        error: error?.response?.data?.message ?? error.message,
      });

      return error?.response?.data ?? { success: false, message: "Failed to load product." };
    }
  },
}));

export default useShopStore;