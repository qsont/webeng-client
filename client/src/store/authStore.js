import axios from "axios";
import { create } from "zustand";

const API_URL = import.meta.env.VITE_API;

const useAuthStore = create((set) => ({

  isLoading: true,
  isChecking: true,
  isAuthenticated: false,
  user: null,
  error: null,

  // Callers
  checkAuth: async () => {
    set({ isLoading: true, isChecking: true });
    try {
      const response = await axios.get(`/auth/check-auth`, { baseURL: API_URL, withCredentials: true });
      if (!response?.data?.success) throw new Error("Login failed");
      set({
        isAuthenticated: true,
        isLoading: false,
        isChecking: false,
        user: response?.data?.user
      });
      return response?.data?.success;
    }
    catch (error) {
      set({
        isLoading: false,
        isChecking: false,
        isAuthenticated: false,
        user: null,
        error: error.message
      });
      return error?.response?.data ?? { success: false, message: "Network error. Please try again." }
    }
  },

  login: async (formData) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`/auth/login`, formData, { baseURL: API_URL, withCredentials: true });
      set({ isLoading: false });
      // if (!response?.data?.success) throw response?.data;
      set({
        isAuthenticated: true,
        isLoading: false,
        user: response?.data?.user
      });
      return response?.data;
    }
    catch (error) {
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: error.message
      });
      return error?.response?.data ?? { success: false, message: "Network error. Please try again." }
    }
  },

  register: async (formData) => {
    set({ isLoading: true });
    console.log(API_URL)
    try {
      const response = await axios.post(`/auth/register`, formData, { baseURL: API_URL, withCredentials: true });
      set({ isLoading: false });
      return response?.data
    }
    catch (error) {
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: error.message
      });
      return error?.response?.data ?? { success: false, message: "Network error. Please try again." }
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.delete(`/auth/logout`, { baseURL: API_URL, withCredentials: true });
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null
      });
      return response?.data;
    }
    catch (error) {
      set({
        isLoading: false,
        error: error.message
      });
      return error?.response?.data ?? { success: false, message: "Network error. Please try again." }
    }
  }

}));

export default useAuthStore;