import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

/**
 * Provides wishlist state and handlers.
 * Persists to localStorage under a per-user key.
 */
export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const storageKey = user ? `wishlist_${user.id}` : 'wishlist_guest';

  // Initialize from localStorage (per-user)
  const [wishlistItems, setWishlistItems] = useState(() => {
    const stored = localStorage.getItem(storageKey);
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

  /** Clear the entire wishlist */
  const clearWishlist = () => setWishlistItems([]);

  // Persist changes to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(wishlistItems));
  }, [wishlistItems, storageKey]);

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
