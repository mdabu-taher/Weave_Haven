import React, { useState } from 'react';
// Change alias import to relative path
import { createFeedback } from '../utils/api';

export default function FeedbackForm({ orderId, productId, onSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await createFeedback({ orderId, productId, rating, comment });
      onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-4 bg-white rounded shadow">
      {error && <p className="text-red-500">{error}</p>}
      <label>
        Rating:
        <select value={rating} onChange={e => setRating(+e.target.value)}>
          {[5,4,3,2,1,0].map(n => (
            <option key={n} value={n}>
              {n === 0 ? '0 – No Rating' : `${n} Star${n > 1 ? 's' : ''}`}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        Comment:
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          className="w-full border rounded p-2"
        />
      </label>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Submit Feedback
      </button>
    </form>
  );
}
