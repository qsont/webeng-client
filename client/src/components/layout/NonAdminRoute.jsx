import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/authStore";

function NonAdminRoute() {
  const isChecking = useAuthStore((state) => state.isChecking);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (isChecking) {
    return null;
  }

  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}

export default NonAdminRoute;
