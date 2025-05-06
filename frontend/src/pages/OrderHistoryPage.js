// src/pages/OrderHistoryPage.js

import React, { useEffect, useState } from 'react';
import api from '../utils/api';               // your axios instance + interceptors
import '../styles/AccountPages.css';

// Feedback UI components
import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error('Failed to fetch orders:', err));
  }, [refresh]);

  const handleSubmitted = () => {
    setRefresh(prev => prev + 1);
  };

  return (
    <div className="account-container">
      <h2>🧾 Your Order History</h2>

      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>

              <ul className="order-items">
                {order.orderItems.map((item, idx) => {
                  // Safely extract productId, handling possible null
                  const product = item.product;
                  const productId = product
                    ? (product._id || product)
                    : null;

                  return (
                    <li key={idx} className="order-item">
                      <img
                        src={item.image || '/images/no-image.png'}
                        alt={item.name}
                        className="order-item-image"
                      />
                      <div className="order-item-info">
                        <p className="item-name">{item.name}</p>
                        <p>
                          {item.qty} × ${item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Only show feedback UI when delivered and productId exists */}
                      {order.status === 'Delivered' && productId && (
                        <div className="feedback-section">
                          <h4>Your Review for {item.name}</h4>
                          <FeedbackList
                            productId={productId}
                            key={`list-${refresh}-${productId}`}
                          />
                          <FeedbackForm
                            orderId={order._id}
                            productId={productId}
                            onSubmitted={handleSubmitted}
                          />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <p className="order-total">
                <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
