// src/components/FeedbackList.js

import React, { useEffect, useState } from 'react';
import { fetchProductFeedback } from '../utils/api';

export default function FeedbackList({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch feedback whenever productId changes
  useEffect(() => {
    setLoading(true);
    fetchProductFeedback(productId)
      .then(data => setReviews(data))
      .catch(err => console.error('Failed to load feedback:', err))
      .finally(() => setLoading(false));
  }, [productId]);

  // Calculate average rating
  const average =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  if (loading) {
    return <p>Loading reviews…</p>;
  }

  if (reviews.length === 0) {
    return <p>No reviews yet. Be the first to review this product!</p>;
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="text-2xl font-bold">{average} ★</div>
        <div className="text-gray-600">({reviews.length} review{reviews.length > 1 ? 's' : ''})</div>
      </div>

      {/* Individual reviews */}
      {reviews.map(fb => (
        <div key={fb._id} className="p-4 bg-gray-50 rounded shadow">
          <p className="font-semibold">
            {fb.user.name}{' '}
            <span className="text-gray-500">
              ({new Date(fb.createdAt).toLocaleDateString()})
            </span>
          </p>
          <p className="text-lg">
            {'★'.repeat(fb.rating)}
            {'☆'.repeat(5 - fb.rating)}
          </p>
          {fb.comment && <p className="mt-2">{fb.comment}</p>}
        </div>
      ))}
    </div>
  );
}
