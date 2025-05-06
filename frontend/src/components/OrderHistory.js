// src/components/OrderHistory.js
import React, { useState } from 'react';
import FeedbackForm from '@/components/FeedbackForm';
import FeedbackList from '@/components/FeedbackList';

export default function OrderHistory({ order }) {
  const [refresh, setRefresh] = useState(0);
  const handleSubmitted = () => setRefresh(r => r + 1);

  return (
    <div className="space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold">Order #{order._id}</h2>
      <p>Status: {order.status}</p>
      <ul className="divide-y">
        {order.orderItems.map(item => (
          <li key={item.product._id} className="py-3">
            <div className="flex justify-between items-center">
              <span>{item.name} × {item.qty}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>

            {/* Feedback UI only for delivered orders */}
            {order.status === 'Delivered' && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-bold">Your Review for {item.name}</h3>
                <FeedbackList
                  productId={item.product._id}
                  key={`list-${refresh}-${item.product._id}`}
                />
                <FeedbackForm
                  orderId={order._id}
                  productId={item.product._id}
                  onSubmitted={handleSubmitted}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
