import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const { cartItems, addToCart, removeFromCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Failed to load product:', err));
  }, [id]);

  if (!product) return <p>Loading product details...</p>;

  const inCart = cartItems.some(item => item.id === product._id);
  const inWishlist = wishlistItems.some(item => item.id === product._id);

  const handleCartToggle = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please choose your size and color before adding to cart.');
      return;
    }

    const payload = {
      id: product._id,
      name: product.name,
      price: Number(product.price),
      image: `http://localhost:5000${product.image}`,
      size: selectedSize,
      color: selectedColor
    };

    inCart ? removeFromCart(product._id) : addToCart(payload);
  };

  const handleWishlistToggle = () => {
    const payload = {
      id: product._id,
      name: product.name,
      price: Number(product.price),
      image: `http://localhost:5000${product.image}`,
    };
    inWishlist ? removeFromWishlist(product._id) : addToWishlist(payload);
  };

  return (
    <div className="product-detail-container">
      <img
        src={`http://localhost:5000${product.image}`}
        alt={product.name}
        className="product-image"
      />

      <div className="product-details">
        <h2>{product.name}</h2>
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Material:</strong> {product.material}</p>
        <p>{product.description}</p>

        {/* Choose Size */}
        <div className="size-selector">
          <label><strong>Choose Size:</strong></label>
          <div className="size-options">
            {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(size => {
              const isAvailable = product.sizes?.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => isAvailable && setSelectedSize(size)}
                  className={`size-btn ${size === selectedSize ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}`}
                  disabled={!isAvailable}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Choose Color */}
        <div className="color-selector">
          <label><strong>Choose Color:</strong></label>
          <div className="color-options">
            {(product.colors ?? []).map(color => (
              <div
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`color-swatch ${color === selectedColor ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className={`cart-btn ${inCart ? 'outlined' : 'filled'}`}
            onClick={handleCartToggle}
          >
            <FaShoppingBag /> {inCart ? 'Remove from Cart' : 'Add to Cart'}
          </button>

          <button
            className={`wishlist-btn ${inWishlist ? 'filled' : 'outlined'}`}
            onClick={handleWishlistToggle}
          >
            <FaHeart /> {inWishlist ? 'Wishlisted' : 'Wishlist'}
          </button>
        </div>
      </div>
    </div>
  );
}
