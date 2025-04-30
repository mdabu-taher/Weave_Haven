import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AddProduct from './pages/AddProduct';
import AllProducts from './pages/AllProducts';
import FavoritesPage from './pages/FavoritesPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import ProductsList from "./pages/ProductsList";
import Cart from "./pages/Cart";

import Home from "./pages/Home";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { CartProvider } from "./context/CartContext";

// NEW account menu pages
import AccountPage from './pages/AccountPages';
import OrderHistoryPage from './pages/OrderHistoryPage';
import MembershipPage from './pages/MembershipPage';
import BonusPage from './pages/BonusPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />

        <Routes>
          {/* Core Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<FavoritesPage />} />

          {/* Info */}
          <Route path="/about" element={<About />} />
          <Route path="/new-arrivals" element={<AllProducts />} />
          <Route path="/women" element={<AllProducts />} />
          <Route path="/men" element={<AllProducts />} />
          <Route path="/kids" element={<AllProducts />} />
          <Route path="/teens" element={<AllProducts />} />
          <Route path="/newborn" element={<AllProducts />} />

          {/* Search + Auth */}
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Profile Management */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />

          {/* 🧾 Account Menu Routes */}
          <Route path="/account" element={<AccountPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/bonus" element={<BonusPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>

        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
