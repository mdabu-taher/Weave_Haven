import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function AllProducts() {
  const [products, setProducts] = useState([]);

  const location = useLocation();
  const categoryFromPath = location.pathname.replace('/', '');

  useEffect(() => {
    (async () => {
      try {
        // Always fetch all products
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();

        let filtered = data;

        if (categoryFromPath === 'new-arrivals') {
          // Show only products created in the last 14 days
          const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;
          const cutoff = Date.now() - TWO_WEEKS_MS;
          filtered = data.filter(
            p => new Date(p.createdAt).getTime() >= cutoff
          );
        } else if (categoryFromPath) {
          // Filter by category
          filtered = data.filter(
            p =>
              p.category &&
              p.category.toLowerCase() === categoryFromPath.toLowerCase()
          );
        }

        setProducts(filtered);
      } catch (err) {
        console.error('❌ Error fetching products:', err);
      }
    })();
  }, [categoryFromPath]);

  return (
    <div style={{ padding: 20 }}>
      <h2>
        {categoryFromPath
          ? categoryFromPath.replace('-', ' ')
          : 'All Products'}
      </h2>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20
        }}
      >
        {products.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          products.map(product => {
            // Use either `image` or fall back to first photo
            const imgUrl = `http://localhost:5000${
              product.image || product.photos?.[0] || ''
            }`;

            return (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  width: 220,
                  padding: 10,
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <img
                  src={imgUrl}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover'
                  }}
                />
                <h3>{product.name}</h3>
                <p>
                  <strong>SEK {product.price}</strong>
                </p>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
