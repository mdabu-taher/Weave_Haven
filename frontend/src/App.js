// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home           from './pages/Home';
import Login          from './pages/Login';
import Signup         from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';  // ← newly added
import ResetPassword  from './pages/ResetPassword';   // ← newly added

// import other pages as you build them:
// import ProductsList   from './pages/ProductsList';
// import ProductDetails from './pages/ProductDetails';
// import Cart           from './pages/Cart';
// import Checkout       from './pages/Checkout';
// import NotFound       from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login"           element={<Login />} />
        <Route path="/signup"          element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Product pages */}
        {/* <Route path="/products"       element={<ProductsList />} /> */}
        {/* <Route path="/product/:id"    element={<ProductDetails />} /> */}

        {/* Cart & Checkout */}
        {/* <Route path="/cart"           element={<Cart />} /> */}
        {/* <Route path="/checkout"       element={<Checkout />} /> */}

        {/* Fallback for 404 */}
        {/* <Route path="*"               element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
