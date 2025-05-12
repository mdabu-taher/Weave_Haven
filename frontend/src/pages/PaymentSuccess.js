import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PaymentSuccess.css';

export default function PaymentSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    address,
    shippingCompany,
    paymentMethod,
    total
  } = state || {};

  return (
    <div className="success-container">
      <div className="success-box">
        <h2 className="success-title">🎉 Payment Successful!</h2>
        <h1 className= "success-message">Thanks for shopping with us! Your order's on it's way, and we can't wait for you to enjoy it. Need anything? We're just a click away!</h1>
        <div className="success-details">
          <p><strong>📍 Delivery Address:</strong> {address}</p>
          <p><strong>🚚 Shipping Company:</strong> {shippingCompany}</p>
          <p><strong>💳 Payment Method:</strong> {paymentMethod}</p>
          <p><strong>💰 Total Paid:</strong> SEK{total?.toFixed(2)}</p>
        </div>
        <button className="home-btn" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
}