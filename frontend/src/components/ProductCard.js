// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

export default function ProductCard({ product }) {
  const thumbnail =
    Array.isArray(product.photos) && product.photos.length > 0
      ? product.photos[0]
      : null;

  const imageBaseUrl = process.env.REACT_APP_API_BASE_URL.replace('/api', '');
  const thumbnailUrl = thumbnail ? `${imageBaseUrl}/${thumbnail}` : null;

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-image-link">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={product.name}
            loading="lazy"
            className="product-photo"
          />
        ) : (
          <div className="no-photo">No image available</div>
        )}
      </Link>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">SEK {product.price.toFixed(2)}</p>
        <Link to={`/product/${product._id}`} className="view-btn">
          View
        </Link>
      </div>
    </div>
  );
}
