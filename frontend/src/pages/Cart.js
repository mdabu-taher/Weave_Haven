import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

function Cart() {
  const { cartItems, addToCart, decreaseQuantity, removeFromCart, clearCart } = useCart();

  const totalPrice = cartItems.reduce((total, item) => {
    const priceNumber = parseFloat(item.price.replace('$', '')); // remove $ and convert to number
    return total + (priceNumber * item.quantity);
  }, 0);

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map(item => (
              <li key={item.id} style={{ marginBottom: '15px' }}>
                {item.name} - {item.price} × {item.quantity}
                <div style={{ marginTop: '5px' }}>
                  <button onClick={() => decreaseQuantity(item.id)} style={{ marginRight: '5px' }}>
                    -
                  </button>
                  <button onClick={() => addToCart(item)}>
                    +
                  </button>
                  <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: '10px', color: 'red' }}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <h3 style={{ marginTop: '30px' }}>Total: ${totalPrice.toFixed(2)}</h3>

          <button onClick={clearCart} style={{ marginTop: '20px', backgroundColor: 'red', color: 'white', padding: '10px 20px' }}>
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
