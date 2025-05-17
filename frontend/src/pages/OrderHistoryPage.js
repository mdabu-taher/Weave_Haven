// src/pages/OrderHistoryPage.js

import React, { useEffect, useState } from 'react';
import api from '../utils/api';               // axios instance
import '../styles/AccountPages.css';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  // Build this so it works both locally and in prod
  const API_ROOT = process.env.REACT_APP_API_BASE_URL.replace(/\/api\/?$/, '');

  useEffect(() => {
    api
      .get('/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error('Failed to fetch orders:', err));
  }, []);

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
                  // build absolute URL to the photo
                  const imgPath = item.image || '';
                  const src = imgPath.startsWith('http')
                    ? imgPath
                    : `${API_ROOT}${imgPath}`;

                  return (
                    <li key={idx} className="order-item">
                      <img
                        src={src}
                        alt={item.name}
                        className="order-item-image"
                        onError={e => {
                          // fallback in case that URL still fails
                          e.currentTarget.src = '/images/no-image.png';
                        }}
                      />
                      <div className="order-item-info">
                        <p className="item-name">{item.name}</p>
                        <p>
                          {item.qty} × SEK {item.price.toFixed(2)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <p className="order-total">
                <strong>Total:</strong> SEK {order.totalPrice.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
