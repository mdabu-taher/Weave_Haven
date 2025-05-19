// src/components/FeedbackList.js

import React, { useEffect, useState } from 'react';
import { fetchProductFeedback } from '../utils/api';
import '../styles/FeedbackList.css';

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
    return <p className="feedback-loading">Loading reviews…</p>;
  }

  if (reviews.length === 0) {
    return (
      <p className="feedback-no-reviews">
        No reviews yet. Be the first to review this product!
      </p>
    );
  }

  return (
    <div className="feedback-list">
      {/* Summary */}
      <div className="feedback-summary">
        <div className="feedback-average">{average} ★</div>
        <div className="feedback-count">
          ({reviews.length} review{reviews.length > 1 ? 's' : ''})
        </div>
      </div>

      {/* Individual reviews */}
      {reviews.map(fb => (
        <div key={fb._id} className="review-item">
          <div className="review-header">
            <span className="review-user">
              {/* Optional chaining to avoid null errors */}
              {fb.user?.Fullname || 'Anonymous'}
            </span>
            <span className="review-date">
              {new Date(fb.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="review-stars">
            {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
          </div>
          {fb.comment && (
            <div className="review-comment">{fb.comment}</div>
          )}
        </div>
      ))}
    </div>
  );
}
