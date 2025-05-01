import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Checkout.css';
import axios from 'axios';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItems } = location.state || {};

  const [address, setAddress] = useState('');
  const [shipping, setShipping] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const shippingFee = 25;

  useEffect(() => {
    axios.get('/api/auth/profile', { withCredentials: true })
      .then(res => {
        setUser(res.data);
        setAddress(res.data.address || '');
      })
      .catch(() => setUser(null));
  }, []);

  const subtotal = selectedItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const total = subtotal + (shipping ? shippingFee : 0);

  const handleProceed = () => {
    if (!address.trim()) {
      setError('Please provide your delivery address.');
      return;
    }
    if (!shipping) {
      setError('Please select a shipping company.');
      return;
    }

    navigate('/payment', {
      state: {
        selectedItems,
        address,
        shipping,
        subtotal,
        total,
        shippingFee
      }
    });
  };

  if (!selectedItems?.length) return <p>No items selected for checkout.</p>;

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-section">
        <label>Delivery Address</label>
        <textarea
          rows="3"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your full address"
        />
      </div>

      <div className="checkout-section">
        <label>Shipping Company</label>
        <div className="shipping-options">
          {['DHL', 'PostNord', 'Bring'].map(company => (
            <label key={company}>
              <input
                type="radio"
                name="shipping"
                value={company}
                checked={shipping === company}
                onChange={(e) => setShipping(e.target.value)}
              />
              {company}
            </label>
          ))}
        </div>
      </div>

      <div className="checkout-summary">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Shipping Fee: {shipping ? `$${shippingFee.toFixed(2)}` : '-'}</p>
        <p><strong>Total: ${shipping ? total.toFixed(2) : '-'}</strong></p>
      </div>

      {error && <p className="checkout-error">{error}</p>}

      <button className="checkout-btn" onClick={handleProceed}>
        Proceed to Payment
      </button>
    </div>
  );
}
