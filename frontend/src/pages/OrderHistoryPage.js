import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AccountPages.css';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/orders', { withCredentials: true })
      .then(res => setOrders(res.data))
      .catch(err => console.error('Failed to fetch orders:', err));
  }, []);

  return (
    <div className="account-container">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} - {item.quantity} pcs - ${item.price}
                  </li>
                ))}
              </ul>
              <p><strong>Total:</strong> ${order.totalAmount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
