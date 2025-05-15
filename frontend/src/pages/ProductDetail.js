import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import FeedbackList from '../components/FeedbackList';
import '../styles/ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [mainIdx, setMainIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(true);

  const imageBaseUrl = process.env.REACT_APP_API_BASE_URL.replace('/api', '');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`);
        const data = await res.json();
        setProduct(data);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        if (data.colors?.length) setSelectedColor(data.colors[0]);
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (!product) return <p>Product not found</p>;

  const {
    name,
    description,
    price,
    salePrice,
    material,
    sizes = [],
    colors = [],
    photos = []
  } = product;

  const isOnSale = salePrice != null;
  const discount = isOnSale ? Math.round((1 - salePrice / price) * 100) : 0;
  const mainSrc = photos[mainIdx] ? `${imageBaseUrl}${photos[mainIdx]}` : '';

  const onSizeClick = sz => sizes.includes(sz) && setSelectedSize(sz);
  const onColorClick = clr => colors.includes(clr) && setSelectedColor(clr);

  const onAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select both size and color.');
      return;
    }
    addToCart({
      id,
      name,
      price: isOnSale ? salePrice : price,
      size: selectedSize,
      color: selectedColor,
      image: mainSrc,
      quantity: 1
    });
    alert(`Added to cart: ${name} (${selectedSize}, ${selectedColor})`);
  };

  const onWishlist = () => {
    addToWishlist({
      id,
      name,
      price: isOnSale ? salePrice : price,
      image: mainSrc
    });
    alert(`Added to wishlist: ${name}`);
  };

  return (
    <div className="product-detail-container">
      <div className="images-section">
        {mainSrc ? (
          <img
            src={mainSrc}
            alt={name}
            className="main-photo"
            loading="lazy"
            onClick={() =>
              photos.length > 1 && setMainIdx((mainIdx + 1) % photos.length)
            }
            style={{ cursor: photos.length > 1 ? 'pointer' : 'default' }}
          />
        ) : (
          <div className="no-photo-large">No image available</div>
        )}
        {photos.length > 1 && (
          <div className="thumbnails">
            {photos.map((src, idx) => (
              <img
                key={idx}
                src={`${imageBaseUrl}${src}`}
                alt={`${name} thumbnail ${idx + 1}`}
                className={`thumbnail${idx === mainIdx ? ' selected' : ''}`}
                onClick={() => setMainIdx(idx)}
                loading="lazy"
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-details">
        <h1 className="product-name">{name}</h1>
        <div className="price-block">
          {isOnSale ? (
            <>
              <span className="orig-price">SEK {price.toFixed(2)}</span>
              <span className="sale-price">SEK {salePrice.toFixed(2)}</span>
              <span className="discount-badge">{discount}% OFF</span>
            </>
          ) : (
            <span className="regular-price">SEK {price.toFixed(2)}</span>
          )}
        </div>
        <p><strong>Material:</strong> {material}</p>

        {description && (
          <div className="description-section">
            <h3>Description</h3>
            <p>{description}</p>
          </div>
        )}

        <div className="size-options">
          <p><strong>Choose Size:</strong></p>
          {sizes.map(sz => (
            <button
              key={sz}
              className={`size-btn${sz === selectedSize ? ' selected' : ''}`}
              onClick={() => onSizeClick(sz)}
            >
              {sz}
            </button>
          ))}
        </div>

        <div className="color-options">
          <p><strong>Choose Color:</strong></p>
          {colors.map(clr => (
            <div
              key={clr}
              className={`color-swatch${clr === selectedColor ? ' selected' : ''}`}
              style={{ backgroundColor: clr }}
              onClick={() => onColorClick(clr)}
            />
          ))}
        </div>

        <div className="action-buttons">
          <button className="cart-btn filled" onClick={onAddToCart}>Add to Cart</button>
          <button className="wishlist-btn outlined" onClick={onWishlist}>Wishlist</button>
        </div>
      </div>

      <section className="product-feedback-section">
        <h2 className="feedback-heading">Customer Reviews</h2>
        <FeedbackList productId={id} />
      </section>
    </div>
  );
}
