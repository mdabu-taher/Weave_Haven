import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Cart.css';

function Cart() {
  const {
    cartItems,
    addToCart,
    decreaseQuantity,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
  } = useCart();

  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedItems = cartItems.filter(item => selectedIds.includes(item.id));
  const selectedSubtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map(item => (
              <li key={item.id} className="cart-item">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => handleSelect(item.id)}
                />

                <div className="item-info">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-text">
                    <span className="item-name">{item.name}</span>

                    {item.size && (
                      <p className="item-detail">
                        <strong>Size:</strong> {item.size}
                      </p>
                    )}

                    {item.color && (
                      <div className="item-detail">
                        <strong>Color:</strong>
                        <span
                          className="color-box"
                          style={{
                            backgroundColor: item.color,
                            display: 'inline-block',
                            width: 20,
                            height: 20,
                            border: '1px solid #000',
                            marginLeft: 8,
                            verticalAlign: 'middle'
                          }}
                        ></span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="item-details">
                  <span className="item-price">
                    SEK {(item.price * item.quantity).toFixed(2)}
                  </span>

                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(item.id)} className="qty-btn">–</button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => updateQuantity(item.id, Number(e.target.value))}
                      className="qty-input"
                    />
                    <button onClick={() => addToCart(item)} className="qty-btn">+</button>
                  </div>

                  <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <h3>Full Cart Total: SEK{subtotal.toFixed(2)}</h3>
            <h3>Selected Items Total: SEK{selectedSubtotal.toFixed(2)}</h3>
            <div className="cart-actions">
              <button onClick={clearCart} className="clear-btn">Clear Cart</button>
              <button
                disabled={selectedItems.length === 0}
                onClick={() => navigate('/checkout', { state: { selectedItems } })}
                className="checkout-button"
              >
                Go to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;