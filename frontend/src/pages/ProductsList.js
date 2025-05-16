// src/components/ProductsList.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import '../styles/ProductsList.css';

export default function ProductsList() {
  const { category = '', subCategory } = useParams();
  const slug = category.trim().replace(/\s+/g, '-').toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // strip the trailing '/api' so we can build image URLs
  const imageBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let data = [];

        // Base endpoint: GET /api/products
        const endpoint = '/products';

        if (slug === 'new-arrivals') {
          const res = await api.get(endpoint);
          const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
          data = res.data.filter(p => new Date(p.createdAt).getTime() >= cutoff);
        } else if (slug === 'sale') {
          const res = await api.get(endpoint);
          data = res.data.filter(p => p.onSale);
        } else {
          const params = {};
          if (category)    params.category    = category;
          if (subCategory) params.subCategory = subCategory;

          const res = await api.get(endpoint, { params });
          data = res.data;
        }

        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug, category, subCategory]);

  const heading =
    slug === 'new-arrivals' ? 'New Arrivals' :
    slug === 'sale'         ? 'On Sale'      :
    category                ? category.replace(/-/g, ' ')
                            : 'All Products';

  return (
    <div className="products-container">
      <h2>{heading}</h2>

      {loading ? (
        <p>Loading products…</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="products-grid">
          {products.map(product => {
            const thumb = Array.isArray(product.photos) && product.photos[0];
            const thumbUrl =
              thumb?.startsWith('http')
                ? thumb
                : `${imageBaseUrl}${thumb}`;

            return (
              <div className="product-card" key={product._id}>
                <Link to={`/product/${product._id}`} className="product-image-link">
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt={product.name}
                      className="product-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="no-photo-thumbnail">No image available</div>
                  )}
                </Link>
                <h3>{product.name}</h3>
                <div className="price">
                  {product.salePrice != null ? (
                    <>
                      <span className="orig-price">
                        SEK {product.price.toFixed(2)}
                      </span>
                      <span className="sale-price">
                        SEK {product.salePrice.toFixed(2)}
                      </span>
                      <span className="discount-badge">
                        {Math.round((1 - product.salePrice / product.price) * 100)}% off
                      </span>
                    </>
                  ) : (
                    <span className="regular-price">
                      SEK {product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
