import useAuthentication from "@/hooks/useAuthentication";
import { Outlet, Navigate } from "react-router-dom";

function AuthLayout() {

const { isChecking, path } = useAuthentication();

  if (isChecking) return null;
  if (path) return <Navigate to={path} replace />;

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <Outlet />
    </main>
  );
}

export default AuthLayout;