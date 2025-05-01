import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Payment.css';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedItems = [],
    address,
    shippingCompany,
    total
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });
  const [error, setError] = useState('');

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    if (paymentMethod === 'card') {
      const { name, number, expiry, cvv } = cardDetails;
      if (!name || !number || !expiry || !cvv) {
        setError('Please fill in all card details.');
        return;
      }
    }

    setError('');
    // Simulate payment processing
    setTimeout(() => {
      navigate('/payment-success', {
        state: {
          selectedItems,
          address,
          shippingCompany,
          total,
          paymentMethod
        }
      });
    }, 1000);
  };

  return (
    <div className="payment-container">
      <h2>Choose Payment Method</h2>

      <div className="payment-options">
        {['card', 'paypal', 'swish', 'cod'].map(method => (
          <label key={method} className="payment-radio">
            <input
              type="radio"
              name="payment"
              value={method}
              checked={paymentMethod === method}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            {method === 'card' && 'Credit Card'}
            {method === 'paypal' && 'PayPal'}
            {method === 'swish' && 'Swish'}
            {method === 'cod' && 'Cash on Delivery'}
          </label>
        ))}
      </div>

      {paymentMethod === 'card' && (
        <div className="card-form">
          <h4>Card Details</h4>
          <input
            type="text"
            name="name"
            placeholder="Cardholder Name"
            value={cardDetails.name}
            onChange={handleInput}
          />
          <input
            type="text"
            name="number"
            placeholder="Card Number"
            value={cardDetails.number}
            onChange={handleInput}
          />
          <input
            type="text"
            name="expiry"
            placeholder="MM/YY"
            value={cardDetails.expiry}
            onChange={handleInput}
          />
          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            value={cardDetails.cvv}
            onChange={handleInput}
          />
        </div>
      )}

      <div className="payment-summary">
        <p><strong>Delivery Address:</strong> {address}</p>
        <p><strong>Shipping Company:</strong> {shippingCompany}</p>
        <p><strong>Total:</strong> ${total?.toFixed(2)}</p>
      </div>

      {error && <p className="payment-error">{error}</p>}

      <button className="payment-btn" onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
}
