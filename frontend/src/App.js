// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AddProduct from './pages/AddProduct';
import AllProducts from './pages/AllProducts';
import FavoritesPage from './pages/FavoritesPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProductsList from "./pages/ProductsList";
import Cart from "./pages/Cart";
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import Home from "./pages/Home";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import AccountPage from './pages/AccountPages';
import OrderHistoryPage from './pages/OrderHistoryPage';
import MembershipPage from './pages/MembershipPage';
import BonusPage from './pages/BonusPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/all-products" element={<AllProducts />} />
            <Route path="/products" element={<ProductsList />} />
            <Route path="/products/:category" element={<ProductsList />} />
            <Route path="/products/:category/:subCategory" element={<ProductsList />} />

            <Route path="/product/:id" element={<ProductDetail />} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/favorites" element={<FavoritesPage />} />

            <Route path="/search" element={<SearchResultsPage />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/account" element={<AccountPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/bonus" element={<BonusPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />

            <Route path="/about" element={<About />} />
          </Routes>

          <Footer />
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
