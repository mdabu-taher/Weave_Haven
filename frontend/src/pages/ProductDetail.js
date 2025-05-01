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
  const { cartItems, addToCart, removeFromCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  const isWishlisted = wishlistItems.some(item => item.id === id);
  const isInCart = cartItems.some(item => item.id === id);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Failed to load product:', err));
  }, [id]);

  if (!product) return <p>Loading product details...</p>;

  const productData = {
    id: product._id,
    name: product.name,
    price: Number(product.price),
    image: `http://localhost:5000${product.image}`,
  };

  const handleToggleCart = () => {
    if (isInCart) {
      removeFromCart(product._id);
    } else {
      addToCart(productData);
    }
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(productData);
    }
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

        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button
            className={isInCart ? 'cart-filled' : 'cart-outlined'}
            onClick={handleToggleCart}
          >
            <FaShoppingBag style={{ marginRight: 6 }} />
            {isInCart ? 'Remove from Cart' : 'Add to Cart'}
          </button>

          <button
            className={isWishlisted ? 'wishlist-filled' : 'wishlist-outlined'}
            onClick={handleToggleWishlist}
          >
            <FaHeart style={{ marginRight: 6 }} />
            {isWishlisted ? 'Wishlisted' : 'Wishlist'}
          </button>
        </div>
      </div>
    </div>
  );
}
