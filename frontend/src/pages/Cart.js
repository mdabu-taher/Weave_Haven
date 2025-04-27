import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map(item => (
              <li key={item.id} style={{ marginBottom: '10px' }}>
                {item.name} - {item.price}
                <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: '10px' }}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <button onClick={clearCart} style={{ marginTop: '20px', backgroundColor: 'red', color: 'white', padding: '10px 20px' }}>
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
