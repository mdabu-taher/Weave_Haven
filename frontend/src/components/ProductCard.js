import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

export default function ProductCard({ product }) {
  // Pick the first photo or use a placeholder
  const thumbnail =
    Array.isArray(product.photos) && product.photos.length > 0
      ? product.photos[0]
      : null;

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-image-link">
        {thumbnail ? (
          <img
            src={thumbnail}
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
