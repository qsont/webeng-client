import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Common Pages
const LandingPage = lazy(() => import("./pages/common/LandingPage"));

// Auth Pages
const AuthLayout = lazy(() => import("./components/layout/AuthLayout.jsx"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

// Admin Pages
const AdminLayout = lazy(() => import("./components/layout/AdminLayout.jsx"));
const Dashboard = lazy(() => import("./pages/admin/Admin.jsx"));
const Products = lazy(() => import("./pages/admin/Products.jsx"));
const Orders = lazy(() => import("./pages/admin/Orders.jsx"));
const Transactions = lazy(() => import("./pages/admin/Transactions.jsx"));

const ShopLayout = lazy(() => import("./components/layout/ShopLayout"));
const ShopHome = lazy(() => import("./pages/shop/ShopHome"));


function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p className="p-6 text-sm">Loading page...</p>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Auth */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>

          {/* Shop */}
          <Route path="/shop" element={<ShopLayout />}>
            <Route path="" element={<ShopHome />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  );
}

export default App
