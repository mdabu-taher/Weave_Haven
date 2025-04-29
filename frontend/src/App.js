// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResetPassword  from './pages/ResetPassword';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';

import Home           from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import Profile        from './pages/Profile';
import CreateProfile  from './pages/CreateProfile';
import UpdateProfile  from './pages/UpdateProfile';
import DeleteAccount  from './pages/DeleteAccount';
import ProductsList   from './pages/ProductsList';
import Cart           from './pages/Cart';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Auth */}
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
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
