// frontend/src/pages/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import '../styles/ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Failed to load product:', err));
  }, [id]);

  if (!product) return <p>Loading product details...</p>;

  const handleAddToCart = () => {
    console.log('Add to Cart clicked');
    addToCart({
      id: product._id,
      name: product.name,
      price: Number(product.price),
      image: `http://localhost:5000${product.image}`,
    });
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
            style={{ background: 'black', color: 'white', padding: '10px 16px', borderRadius: 6 }}
            onClick={handleAddToCart}
          >
            <FaShoppingBag style={{ marginRight: 6 }} />
            Add to Cart
          </button>

          <button style={{ background: 'crimson', color: 'white', padding: '10px 16px', borderRadius: 6 }}>
            <FaHeart style={{ marginRight: 6 }} />
            Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}