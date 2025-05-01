import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Payment.css';
import axios from 'axios';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItems = [], address, shippingCompany, total } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [error, setError] = useState('');

  const shippingPrice = 25;
  const taxPrice = 0;
  const itemsPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (!paymentMethod) return setError('Please select a payment method.');
    if (paymentMethod === 'card') {
      const { name, number, expiry, cvv } = cardDetails;
      if (!name || !number || !expiry || !cvv) {
        return setError('Please fill in all card details.');
      }
    }

    const orderPayload = {
      orderItems: selectedItems.map(item => ({
        product: item.id,
        qty: item.quantity,
        price: item.price
      })),
      shippingAddress: {
        fullName: 'N/A',
        addressLine1: address,
        city: 'N/A',
        postalCode: '0000',
        country: 'N/A'
      },
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice: total
    };

    try {
        await axios.post('http://localhost:5000/api/orders', orderPayload, {
            withCredentials: true,
          });
          
      navigate('/payment-success', {
        state: {
          selectedItems,
          address,
          shippingCompany,
          total,
          paymentMethod
        }
      });
    } catch (err) {
      console.error('Order creation failed:', err);
      setError('Order could not be placed. Please try again.');
    }
  };

  return (
    <div className="payment-container">
      <h2>Choose Payment Method</h2>

      <div className="payment-options">
        {[
          { id: 'card', label: 'Credit Card', logo: '/images/visa.png' },
          { id: 'paypal', label: 'PayPal', logo: '/images/paypal.jpeg' },
          { id: 'swish', label: 'Swish', logo: '/images/swish.jpeg' },
          { id: 'cod', label: 'Cash 💵' }
        ].map(method => (
          <label key={method.id} className="payment-radio">
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            {method.logo && <img src={method.logo} alt={method.label} className="payment-logo" />}
            {method.label}
          </label>
        ))}
      </div>

      {paymentMethod === 'card' && (
        <div className="card-form">
          <h4>Card Details</h4>
          <input type="text" name="name" placeholder="Cardholder Name" value={cardDetails.name} onChange={handleInput} />
          <input type="text" name="number" placeholder="Card Number" value={cardDetails.number} onChange={handleInput} />
          <input type="text" name="expiry" placeholder="MM/YY" value={cardDetails.expiry} onChange={handleInput} />
          <input type="text" name="cvv" placeholder="CVV" value={cardDetails.cvv} onChange={handleInput} />
        </div>
      )}
    {paymentMethod === 'paypal' && (
    <div className="qr-payment-info">
        <h4>PayPal Payment</h4>
        <img src="/images/paypal-qr.png" alt="PayPal QR Code" className="qr-code" />
        <p>Pay to: <strong>paypal@example.com</strong></p>
    </div>
    )}

    {paymentMethod === 'swish' && (
    <div className="qr-payment-info">
        <h4>Swish Payment</h4>
        <img src="/images/swish-qr.png" alt="Swish QR Code" className="qr-code" />
        <p>Swish to: <strong>+46701234567</strong></p>
    </div>
    )}

      <div className="payment-summary">
        <p><strong>Delivery Address:</strong> {address}</p>
        <p><strong>Shipping Company:</strong> {shippingCompany}</p>
        <p><strong>Items:</strong> ${itemsPrice.toFixed(2)}</p>
        <p><strong>Shipping:</strong> ${shippingPrice.toFixed(2)}</p>
        <p><strong>Total:</strong> ${total.toFixed(2)}</p>
      </div>

      {error && <p className="payment-error">{error}</p>}

      <button onClick={handlePayment} className="payment-btn">Pay Now</button>
    </div>
  );
}
