import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import SuspenseLoader from "@/components/custom/SuspenseLoader";
import useThemeStore from "@/store/themeStore";

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
const UserProtectedRoute = lazy(() => import("./components/layout/UserProtectedRoute"));
const ShopHome = lazy(() => import("./pages/shop/ShopHome"));
const ProductView = lazy(() => import("./pages/shop/ProductView"));
const AboutView = lazy(() => import("./pages/shop/AboutView"));
const ContactView = lazy(() => import("./pages/shop/ContactView"));
const CartView = lazy(() => import("./pages/shop/CartView"));


function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <BrowserRouter>
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route index element={<LandingPage />} />

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

          {/* User-facing routes */}
          <Route element={<ShopLayout />}>
            <Route path="/shop" element={<ShopHome />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="/contact" element={<ContactView />} />

            <Route element={<UserProtectedRoute />}>
              <Route path="/product/:productId" element={<ProductView />} />
              <Route path="/cart" element={<CartView />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  );
}

export default App
