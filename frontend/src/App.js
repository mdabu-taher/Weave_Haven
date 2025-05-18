// src/App.jsx

import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminNavbar from "./components/admin/AdminNavbar";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import WelcomePage from "./components/WelcomePage";
import AddProduct from "./pages/AddProduct";
import AllProducts from "./pages/AllProducts";
import ProductsList from "./pages/ProductsList";
import ProductDetail from "./pages/ProductDetail";
import FavoritesPage from "./pages/FavoritesPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AccountPage from "./pages/AccountPages";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import MembershipPage from "./pages/MembershipPage";
import BonusPage from "./pages/BonusPage";
import SettingsPage from "./pages/SettingsPage";
import About from "./components/About";

import RequireAdmin from "./components/admin/RequireAdmin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import EditProductPage from "./pages/admin/EditProductPage";

function AppContent() {
  const { pathname } = useLocation();

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute  = ["/login", "/register", "/welcome"].includes(pathname);

  return (
    <>
      {/* Top navbar */}
      {isAdminRoute ? (
        <AdminNavbar />
      ) : !isAuthRoute ? (
        <Navbar />
      ) : null}

      <main className="min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />

          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:category" element={<ProductsList />} />
          <Route path="/products/:category/:subCategory" element={<ProductsList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/bonus" element={<BonusPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<About />} />

          {/* Admin routes */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="products">
                <Route index element={<AdminProductsPage />} />
                <Route path="new" element={<AddProduct />} />
                <Route path=":id/edit" element={<EditProductPage />} />

              </Route>
              <Route path="orders" element={<AdminOrders />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </main>

      {/* Footer only on non-admin, non-auth pages */}
      {!isAdminRoute && !isAuthRoute && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
