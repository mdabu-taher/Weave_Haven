// src/pages/FavoritesPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import '../styles/FavoritesPage.css';

export default function FavoritesPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="favorites-page">
        <h2>Your Wishlist</h2>
        <p>You have no items in your wishlist.</p>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <h2>Your Wishlist</h2>
      <div className="favorites-grid">
        {wishlistItems.map(item => (
          <div className="favorite-card" key={item.id}>
            <Link to={`/product/${item.id}`} className="favorite-image-link">
              <img
                src={item.image || (item.photos && item.photos[0]) || '/placeholder.png'}
                alt={item.name}
                className="favorite-image"
              />
            </Link>
            <div className="favorite-info">
              <h3>{item.name}</h3>
              <p>SEK {Number(item.price).toFixed(2)}</p>
              <button
                className="remove-btn"
                onClick={() => removeFromWishlist(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
