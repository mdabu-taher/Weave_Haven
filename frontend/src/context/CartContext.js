import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

/**
 * Provides cart state and handlers.
 * Persists to localStorage under a per-user key.
 */
export function CartProvider({ children }) {
  const { user } = useAuth();
  const storageKey = user ? `cart_${user.id}` : 'cart_guest';

  // Initialize cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Rehydrate when user changes
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    setCartItems(saved ? JSON.parse(saved) : []);
  }, [storageKey]);

  // Persist cart to localStorage per user
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, storageKey]);

  // --- Cart Methods ---

  /** Add a product or increment quantity if exists */
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  /** Decrease quantity or remove if zero */
  const decreaseQuantity = (id) => {
    setCartItems(prev =>
      prev
        .map(i => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter(i => i.quantity > 0)
    );
  };

  /** Update specific quantity */
  const updateQuantity = (id, quantity) => {
    setCartItems(prev =>
      quantity <= 0
        ? prev.filter(i => i.id !== id)
        : prev.map(i => (i.id === id ? { ...i, quantity } : i))
    );
  };

  /** Remove product entirely */
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  /** Clear all items in cart */
  const clearCart = () => setCartItems([]);

  /** Compute subtotal */
  const subtotal = cartItems.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );

  // Clear cart on logout
  useEffect(() => {
    const handleLogout = () => setCartItems([]);
    window.addEventListener('logout', handleLogout);
    return () => window.removeEventListener('logout', handleLogout);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        decreaseQuantity,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/** Hook to access cart state & actions */
export function useCart() {
  return useContext(CartContext);
}