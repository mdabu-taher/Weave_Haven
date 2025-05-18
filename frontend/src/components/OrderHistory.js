// src/components/OrderHistory.js
import React, { useState } from 'react';
import FeedbackList from './FeedbackList';
import FeedbackForm from './FeedbackForm';
import '../styles/OrderHistory.css';

export default function OrderHistory({ order, apiRoot }) {
  const [refresh, setRefresh] = useState(0);
  const handleSubmitted = () => setRefresh(r => r + 1);

  // Normalize status
  const status = String(order.status || '').toLowerCase().trim();
  const canReview = status === 'delivered';

  return (
    <div className="order-card">
      <div className="order-header">
        <h3>Order #{order._id}</h3>
        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        <p>Status: {order.status}</p>
      </div>

      <ul>
        {order.orderItems
          // skip any malformed entries
          .filter(item => item && item.product)
          .map((item, idx) => {
            // productId may be an object or an ID string
            const productId = item.product._id || item.product;
            // build correct thumbnail URL
            const imgPath = item.image || '';
            const src = imgPath.startsWith('http')
              ? imgPath
              : `${apiRoot}${imgPath}`;

            return (
              <li key={idx} className="order-item">
                <img
                  src={src}
                  alt={item.name}
                  className="order-item-image"
                  onError={e => (e.currentTarget.src = '/images/no-image.png')}
                />

                <div className="order-item-info">
                  <p className="item-name">{item.name}</p>
                  <p>
                    {item.qty} × SEK {item.price.toFixed(2)}
                  </p>
                </div>

                <p className="item-subtotal">
                  SEK {(item.qty * item.price).toFixed(2)}
                </p>

                {canReview && (
                  <div className="review-section">
                    <h4>Your Review for {item.name}</h4>
                    <FeedbackList
                      productId={productId}
                      key={`list-${order._id}-${productId}-${refresh}`}
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
        Total: SEK {order.totalPrice.toFixed(2)}
      </p>
    </div>
  );
}
