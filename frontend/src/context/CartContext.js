import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Load cart from LocalStorage initially
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Add to Cart (if exists, increase quantity by 1)
  const addToCart = product => {
    setCartItems(prev =>
      prev.some(item => item.id === product.id)
        ? prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...product, quantity: 1 }]
    );
  };

  // Decrease quantity by 1 (removes if quantity hits 0)
  const decreaseQuantity = id => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  // **Set** an exact quantity (new helper)  
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      // Remove if zero or negative
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  // Remove item completely
  const removeFromCart = id => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Clear entire cart
  const clearCart = () => setCartItems([]);

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Persist in localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        decreaseQuantity,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook
export function useCart() {
  return useContext(CartContext);
}
