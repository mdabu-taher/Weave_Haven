import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AccountPages.css';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get('/api/orders', { withCredentials: true })
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
              <h3>Order ID: <span>{order._id}</span></h3>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <ul className="order-items">
                {order.orderItems.map((item, index) => (
                  <li key={index} className="order-item">
                    {item.image && (
                      <img src={item.image} alt={item.name || 'Product'} className="order-item-image" />
                    )}
                    <div className="order-item-info">
                      <span className="order-item-name">{item.name || item.product?.name || 'Item'}</span>
                      <span>{item.qty} pcs – ${item.price}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="order-total"><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
            </div>
          ))}
        </div>

      )}
    </div>
  );
}
