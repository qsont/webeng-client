import { useState } from "react";
import useAuthentication from "@/hooks/useAuthentication";
import { ClipboardList, LayoutDashboard, Package, ReceiptText, Menu, X, Sun, Moon, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import useThemeStore from "@/store/themeStore";
import useAuthStore from "@/store/authStore";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isChecking, path } = useAuthentication();
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const logout = useAuthStore((state) => state.logout);
  const isDark = theme === "dark";

  if (isChecking) return null;
  if (path) return <Navigate to={path} replace />;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr] bg-background">
      {/* Mobile Burger Menu */}
      <div className="md:hidden border-b bg-brand-violet-50/40 p-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-brand-violet-700">Admin Panel</h2>
        <button onClick={toggleSidebar} className="p-1 hover:bg-brand-violet-100 rounded-md transition-colors">
          {sidebarOpen ? <X className="size-5 text-brand-violet-700" /> : <Menu className="size-5 text-brand-violet-700" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`ui-scrollbar border-b md:border-b-0 md:border-r p-3 sm:p-4 space-y-2 bg-brand-violet-50/40 overflow-x-auto absolute md:relative w-full md:w-auto top-14 md:top-0 z-50 md:z-auto transition-all duration-300 flex flex-col ${
        sidebarOpen ? "left-0" : "-left-full md:left-0"
      }`}>
        <h2 className="hidden md:block text-base sm:text-lg font-semibold px-2 py-1 text-brand-violet-700 whitespace-nowrap">Admin Panel</h2>
        <nav className="grid grid-cols-1 gap-1">
          <NavLink
            to="/admin/dashboard"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm transition-colors inline-flex items-center gap-2 ${
                isActive ? "bg-brand-violet-600 text-white" : "hover:bg-brand-violet-100 text-brand-violet-800"
              }`
            }>
            <LayoutDashboard className="size-4 shrink-0" />
            <span className="whitespace-nowrap">Dashboard</span>
          </NavLink>
          <NavLink
            to="/admin/products"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm transition-colors inline-flex items-center gap-2 ${
                isActive ? "bg-brand-violet-600 text-white" : "hover:bg-brand-violet-100 text-brand-violet-800"
              }`
            }>
            <Package className="size-4 shrink-0" />
            <span className="whitespace-nowrap">Products</span>
          </NavLink>
          <NavLink
            to="/admin/orders"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm transition-colors inline-flex items-center gap-2 ${
                isActive ? "bg-brand-violet-600 text-white" : "hover:bg-brand-violet-100 text-brand-violet-800"
              }`
            }>
            <ClipboardList className="size-4 shrink-0" />
            <span className="whitespace-nowrap">Orders</span>
          </NavLink>
          <NavLink
            to="/admin/transactions"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm transition-colors inline-flex items-center gap-2 ${
                isActive ? "bg-brand-violet-600 text-white" : "hover:bg-brand-violet-100 text-brand-violet-800"
              }`
            }>
            <ReceiptText className="size-4 shrink-0" />
            <span className="whitespace-nowrap">Transactions</span>
          </NavLink>
        </nav>

        <div className="mt-auto pt-3 border-t border-brand-violet-200/70 space-y-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm transition-colors inline-flex items-center gap-2 hover:bg-brand-violet-100 text-brand-violet-800"
          >
            {isDark ? <Sun className="size-4 shrink-0" /> : <Moon className="size-4 shrink-0" />}
            <span className="whitespace-nowrap">{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm transition-colors inline-flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <LogOut className="size-4 shrink-0" />
            <span className="whitespace-nowrap">Logout</span>
          </button>
        </div>
      </aside>

      <section className="ui-scrollbar overflow-auto p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </section>
    </main>
  );
}

export default AdminLayout;