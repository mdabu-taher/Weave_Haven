// frontend/src/pages/ProductsList.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/ProductsList.css';

export default function ProductsList() {
  const { category = '', subCategory } = useParams();

  // Normalize any spaces to dashes, lowercase
  const slug = category.trim().replace(/\s+/g, '-').toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let data;

        if (slug === 'new-arrivals') {
          // 1) Fetch all products then filter by createdAt
          const res = await fetch('http://localhost:5000/api/products');
          data = await res.json();
          const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;
          const cutoff = Date.now() - TWO_WEEKS_MS;
          data = data.filter(p => new Date(p.createdAt).getTime() >= cutoff);

        } else {
          // 2) Regular category / subCategory filtering
          const params = new URLSearchParams();
          if (category)    params.append('category', category);
          if (subCategory) params.append('subCategory', subCategory);

          const url = params.toString()
            ? `http://localhost:5000/api/products?${params.toString()}`
            : 'http://localhost:5000/api/products';

          const res = await fetch(url);
          data = await res.json();
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

  // Build a friendly heading
  const heading =
    slug === 'new-arrivals'           ? 'New Arrivals' :
    category                          ? category.replace(/-/g, ' ') :
                                        'All Products';

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
            const thumb = Array.isArray(product.photos) && product.photos.length
              ? product.photos[0]
              : null;
            return (
              <div className="product-card" key={product._id}>
                <Link to={`/product/${product._id}`} className="product-image-link">
                  {thumb
                    ? <img src={thumb} alt={product.name} className="product-image" loading="lazy" />
                    : <div className="no-photo-thumbnail">No image available</div>
                  }
                </Link>
                <h3>{product.name}</h3>
                <p>{product.price.toFixed(2)} SEK</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
