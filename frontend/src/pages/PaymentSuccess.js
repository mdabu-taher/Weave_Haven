import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../styles/Payment.css';

export default function PaymentSuccess() {
  const location = useLocation();
  const { address, shippingCompany, total, paymentMethod } = location.state || {};

  return (
    <div className="payment-success-container">
      <h2>🎉 Payment Successful!</h2>

      <p><strong>Delivery Address:</strong> {address}</p>
      <p><strong>Shipping Company:</strong> {shippingCompany}</p>
      <p><strong>Payment Method:</strong> {
        paymentMethod === 'card' ? 'Credit Card' :
        paymentMethod === 'paypal' ? 'PayPal' :
        paymentMethod === 'swish' ? 'Swish' :
        'Cash on Delivery'
      }</p>
      <p><strong>Total Paid:</strong> ${total?.toFixed(2)}</p>

      <div style={{ marginTop: '2rem' }}>
        <Link to="/" className="payment-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
