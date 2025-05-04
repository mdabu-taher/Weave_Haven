import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/ProductsList.css';

function ProductsList() {
  const { category, subCategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `http://localhost:5000/api/products?category=${category}`;
        if (subCategory) {
          url += `&subCategory=${subCategory}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, subCategory]);

  return (
    <div className="products-container">
      <h2>
        {category}
        {subCategory ? ` › ${subCategory}` : ''}
      </h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="products-grid">
          {products.map(product => {
            // pick the first photo, or fallback
            const thumb =
              Array.isArray(product.photos) && product.photos.length > 0
                ? product.photos[0]
                : null;

            return (
              <div className="product-card" key={product._id}>
                <Link
                  to={`/product/${product._id}`}
                  className="product-image-link"
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={product.name}
                      className="product-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="no-photo-thumbnail">
                      No image available
                    </div>
                  )}
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

export default ProductsList;
