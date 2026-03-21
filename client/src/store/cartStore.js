import axios from "axios";
import { create } from "zustand";

const API_URL = import.meta.env.VITE_API;

const useCartStore = create((set) => ({
  cartItems: [],
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/cart", {
        baseURL: API_URL,
        withCredentials: true,
      });

      set({
        cartItems: response?.data?.cartItems ?? [],
        isLoading: false,
      });
      return response?.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error?.response?.data?.message ?? error.message,
      });
      return error?.response?.data ?? { success: false, message: "Failed to load cart." };
    }
  },

  addToCart: async ({ productId, quantity }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        "/cart",
        { productId, quantity },
        {
          baseURL: API_URL,
          withCredentials: true,
        }
      );

      set({
        cartItems: response?.data?.cartItems ?? [],
        isLoading: false,
      });

      return response?.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error?.response?.data?.message ?? error.message,
      });
      return error?.response?.data ?? { success: false, message: "Failed to add item to cart." };
    }
  },

  updateCartItem: async ({ productId, quantity }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(
        `/cart/${productId}`,
        { quantity },
        {
          baseURL: API_URL,
          withCredentials: true,
        }
      );

      set({
        cartItems: response?.data?.cartItems ?? [],
        isLoading: false,
      });
      return response?.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error?.response?.data?.message ?? error.message,
      });
      return error?.response?.data ?? { success: false, message: "Failed to update cart item." };
    }
  },

  removeCartItem: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`/cart/${productId}`, {
        baseURL: API_URL,
        withCredentials: true,
      });

      set({
        cartItems: response?.data?.cartItems ?? [],
        isLoading: false,
      });
      return response?.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error?.response?.data?.message ?? error.message,
      });
      return error?.response?.data ?? { success: false, message: "Failed to remove cart item." };
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete("/cart", {
        baseURL: API_URL,
        withCredentials: true,
      });

      set({ cartItems: [], isLoading: false });
      return response?.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error?.response?.data?.message ?? error.message,
      });
      return error?.response?.data ?? { success: false, message: "Failed to clear cart." };
    }
  },

  checkoutCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        "/cart/checkout",
        {},
        {
          baseURL: API_URL,
          withCredentials: true,
        }
      );

      set({
        cartItems: response?.data?.cartItems ?? [],
        isLoading: false,
      });

      return response?.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error?.response?.data?.message ?? error.message,
      });
      return error?.response?.data ?? { success: false, message: "Checkout failed." };
    }
  },
}));

export default useCartStore;