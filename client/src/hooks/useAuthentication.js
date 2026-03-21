import useAuthStore from "@/store/authStore";
import { useLocation } from "react-router-dom";

export default function useAuthentication() {

  const user = useAuthStore((state) => state.user);
  const isChecking = useAuthStore((state) => state.isChecking);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const location = useLocation();

  let path = null;

  if (!isChecking) {
    if (!isAuthenticated && location.pathname !== "/" && !location.pathname.startsWith("/auth")) path = "/";
    // Already authenticated
    else if (isAuthenticated && location.pathname.startsWith("/auth")) path = "/";
    // Unauthorized user
    else if (user?.role !== "admin" && location.pathname.includes("/admin")) path = "/shop";
    // Wrong privilege
    else if (user?.role === "admin" && location.pathname.includes("/shop")) path = "/admin/dashboard";
  }

  return { isChecking, path }
}