import { create } from "zustand";
import { persist } from "zustand/middleware";

const applyThemeClass = (theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
};

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "light",

      initializeTheme: () => {
        const savedTheme = get().theme;
        if (savedTheme === "dark" || savedTheme === "light") {
          applyThemeClass(savedTheme);
          return;
        }

        const prefersDark =
          typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;

        const nextTheme = prefersDark ? "dark" : "light";
        set({ theme: nextTheme });
        applyThemeClass(nextTheme);
      },

      setTheme: (nextTheme) => {
        if (nextTheme !== "dark" && nextTheme !== "light") return;
        set({ theme: nextTheme });
        applyThemeClass(nextTheme);
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        set({ theme: nextTheme });
        applyThemeClass(nextTheme);
      },
    }),
    {
      name: "ui-theme",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

export default useThemeStore;
