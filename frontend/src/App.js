import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddProduct from './pages/AddProduct';
import AllProducts from './pages/AllProducts';
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";          // ← NEW
import About from "./components/About"; 
/* pages */
import Home from "./pages/Home";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import CreateProfile from "./pages/CreateProfile";
import UpdateProfile from "./pages/UpdateProfile";

import DeleteAccount from "./pages/DeleteAccount";
import ProductsList from "./pages/ProductsList";
import Cart from "./pages/Cart";


function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />

        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/all-products" element={<AllProducts />} />
          {/* Authentication */}
   
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Profile Management */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />

          <Route path="/delete-account" element={<DeleteAccount />} />

          {/* Products and Cart */}
          <Route path="/products" element={<ProductsList />} />
          <Route path="/cart" element={<Cart />} />

          {/* Info */}
          <Route path="/about" element={<About />} />   {/* ← NEW */}
          <Route path="/new-arrivals" element={<AllProducts />} />
<Route path="/women" element={<AllProducts />} />
<Route path="/men" element={<AllProducts />} />
<Route path="/kids" element={<AllProducts />} />
<Route path="/teens" element={<AllProducts />} />
<Route path="/newborn" element={<AllProducts />} />n
          {/* TODO: add 404 route */}
        </Routes>

        <Footer />   {/* ← rendered on every page */}
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;