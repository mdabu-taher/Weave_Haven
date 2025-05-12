import React, { useState } from 'react';
import { createFeedback } from '../utils/api';
import '../styles/FeedbackForm.css';

export default function FeedbackForm({ orderId, productId, onSubmitted }) {
  const [rating, setRating]   = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError]     = useState(null);

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
    <form onSubmit={handleSubmit} className="feedback-form">
      <h3 className="form-heading">Your Review</h3>

      {error && <p className="error-text">{error}</p>}

      {/* Star Rating */}
      <div className="rating-stars">
        {[5, 4, 3, 2, 1].map(n => (
          <React.Fragment key={n}>
            <input
              type="radio"
              id={`star${n}`}
              name="rating"
              value={n}
              checked={rating === n}
              onChange={() => setRating(n)}
            />
            <label htmlFor={`star${n}`} title={`${n} Star${n > 1 ? 's' : ''}`}>
              ★
            </label>
          </React.Fragment>
        ))}
      </div>

      {/* Comment box */}
      <label className="feedback-label">
        Comment:
        <textarea
          className="feedback-textarea"
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={4}
          placeholder="Write your thoughts..."
        />
      </label>

      <button type="submit" className="submit-feedback-btn">
        Submit Feedback
      </button>
    </form>
  );
}
