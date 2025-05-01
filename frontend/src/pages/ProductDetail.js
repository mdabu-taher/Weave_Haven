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
      .then(res => {
        setProduct(res.data);
        setSelectedSize(res.data.sizes?.[0] || '');
        setSelectedColor(res.data.colors?.[0] || '');
      })
      .catch(err => console.error('Failed to load product:', err));
  }, [id]);

  if (!product) return <p>Loading product details...</p>;

  const inCart = cartItems.some(item => item.id === product._id);
  const inWishlist = wishlistItems.some(item => item.id === product._id);

  const handleCartToggle = () => {
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
    <div className="product-detail-container" style={{ display: 'flex', padding: '2rem', gap: '2rem' }}>
      <img
        src={`http://localhost:5000${product.image}`}
        alt={product.name}
        style={{ width: 400, height: 400, objectFit: 'cover', borderRadius: '10px' }}
      />

      <div style={{ maxWidth: 500 }}>
        <h2>{product.name}</h2>
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Material:</strong> {product.material}</p>
        <p>{product.description}</p>

        {/* Choose Size */}
        <div style={{ marginTop: '1rem' }}>
          <label><strong>Choose Size:</strong></label>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            {(product.sizes ?? []).length === 0 ? (
              <span style={{ fontStyle: 'italic' }}>No sizes available</span>
            ) : (
              product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '5px 12px',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    background: size === selectedSize ? '#000' : '#fff',
                    color: size === selectedSize ? '#fff' : '#000'
                  }}
                >
                  {size}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Choose Color */}
        <div style={{ marginTop: '1rem' }}>
          <label><strong>Choose Color:</strong></label>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            {(product.colors ?? []).length === 0 ? (
              <span style={{ fontStyle: 'italic' }}>No colors available</span>
            ) : (
              product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    padding: '5px 12px',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    background: color === selectedColor ? color : '#fff',
                    color: color === selectedColor ? '#fff' : '#000'
                  }}
                >
                  {color}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
          <button
            style={{ background: inCart ? 'white' : 'black', color: inCart ? 'black' : 'white', padding: '10px 16px', borderRadius: 6, border: '1px solid black' }}
            onClick={handleCartToggle}
          >
            <FaShoppingBag style={{ marginRight: 6 }} />
            {inCart ? 'Remove from Cart' : 'Add to Cart'}
          </button>

          <button
            style={{
              background: inWishlist ? 'crimson' : 'white',
              color: inWishlist ? 'white' : 'crimson',
              padding: '10px 16px',
              borderRadius: 6,
              border: '1px solid crimson'
            }}
            onClick={handleWishlistToggle}
          >
            <FaHeart style={{ marginRight: 6 }} />
            {inWishlist ? 'Wishlisted' : 'Wishlist'}
          </button>
        </div>
      </div>
    </div>
  );
}