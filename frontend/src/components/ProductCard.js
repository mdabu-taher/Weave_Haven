import React from 'react';
export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.images[0]} alt={product.name} loading="lazy" />
      <h3>{product.name}</h3>
      <p>${product.price.toFixed(2)}</p>
    </div>
  );
}
