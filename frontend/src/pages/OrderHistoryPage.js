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
      <h2>🧾 Your Order History</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>

              <ul className="order-items">
                {order.orderItems.map((item, index) => (
                  <li key={index} className="order-item">
                    <img
                      src={item.image || '/images/no-image.png'}
                      alt={item.name}
                      className="order-item-image"
                    />
                    <div className="order-item-info">
                      <p className="item-name">{item.name}</p>
                      <p>{item.qty} × ${item.price.toFixed(2)}</p>
                    </div>
                  </li>
                ))}
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
