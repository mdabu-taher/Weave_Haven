import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { CartProvider } from './context/CartContext'; // <-- Import Cart Context
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import CreateProfile from './pages/CreateProfile';
import UpdateProfile from './pages/UpdateProfile';
import ChangePassword from './pages/ChangePassword';
import DeleteAccount from './pages/DeleteAccount';
import ProductsList from './pages/ProductsList';
import Cart from './pages/Cart';

function App() {
  return (
    <BrowserRouter>
      <CartProvider> {/* Wrap everything so all pages can access cart */}
        <Navbar />
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Profile Management */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/delete-account" element={<DeleteAccount />} />

          {/* Products and Cart */}
          <Route path="/products" element={<ProductsList />} />
          <Route path="/cart" element={<Cart />} />

          {/* You can add 404 Not Found page later */}
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
