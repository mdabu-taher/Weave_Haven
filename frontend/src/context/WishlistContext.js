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
    setWishlistItems((prev) =>
      prev.some((item) => item.id === product.id) ? prev : [...prev, product]
    );
  };

  /** Remove a product by ID */
  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearWishlist = () => setWishlistItems([]);

  // Persist changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Listen for logout event and clear in-memory state
  useEffect(() => {
    const handleLogout = () => setWishlistItems([]);
    window.addEventListener('logout', handleLogout);
    return () => window.removeEventListener('logout', handleLogout);
  }, []);

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

/** Hook to access wishlist state & actions */
export function useWishlist() {
  return useContext(WishlistContext);
}
