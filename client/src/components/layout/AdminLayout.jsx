import useAuthentication from "@/hooks/useAuthentication";
import { Outlet, Navigate } from "react-router-dom";

function AdminLayout() {

const { isChecking, path } = useAuthentication();

  if (isChecking) return <p className="w-full h-screen bg-green-500">Loading...</p>;
  if (path) return <Navigate to={path} replace />;

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <Outlet />
    </main>
  );
}

export default AdminLayout;