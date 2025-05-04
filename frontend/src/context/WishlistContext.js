// src/context/WishlistContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

/**
 * Provides wishlist state and handlers.
 * Persists to localStorage under "wishlist".
 */
export function WishlistProvider({ children }) {
  // Initialize from localStorage
  const [wishlistItems, setWishlistItems] = useState(() => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  });

  /**
   * Add a product to wishlist if not already present.
   * Expects product = { id, name, price, image, ... }
   */
  const addToWishlist = (product) => {
    setWishlistItems(prev =>
      prev.some(item => item.id === product.id) ? prev : [...prev, product]
    );
  };

  /** Remove a product by ID */
  const removeFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  // Persist changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

/** Hook to access wishlist state & actions */
export function useWishlist() {
  return useContext(WishlistContext);
}
