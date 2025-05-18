import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import OrderHistory from '../components/OrderHistory';
import '../styles/AccountPages.css';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  // Build API_ROOT for images (strip /api)
  const API_ROOT = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/api\/?$/, '');

  useEffect(() => {
    api
      .get('/orders')
      .then(res => {
        // Filter out any null or malformed orders
        const list = Array.isArray(res.data)
          ? res.data.filter(o => o && Array.isArray(o.orderItems))
          : [];
        setOrders(list);
      })
      .catch(err => console.error('Failed to fetch orders:', err));
  }, []);

  return (
    <div className="account-container">
      <h2>🧾 Your Order History</h2>

      {orders.length === 0 ? (
        <p>You haven’t placed any orders yet.</p>
      ) : (
        <div className="orders-list space-y-6">
          {orders.map(order => (
            <OrderHistory
              key={order._id}
              order={order}
              apiRoot={API_ROOT}
            />
          ))}
        </div>
      )}
    </div>
  );
}
