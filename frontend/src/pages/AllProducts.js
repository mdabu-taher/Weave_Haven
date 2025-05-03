// frontend/src/pages/AllProducts.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const categoryFromPath = location.pathname.replace('/', '');

  useEffect(() => {
    (async () => {
      try {
        const endpoint =
          categoryFromPath === 'new-arrivals'
            ? 'http://localhost:5000/api/products?new=true'
            : 'http://localhost:5000/api/products';

        const res = await fetch(endpoint);
        const data = await res.json();

        const filtered =
          categoryFromPath && categoryFromPath !== 'new-arrivals'
            ? data.filter(
                p =>
                  p.category &&
                  p.category.toLowerCase() ===
                    categoryFromPath.toLowerCase()
              )
            : data;

        setProducts(filtered);
      } catch (err) {
        console.error('❌ Error fetching products:', err);
      }
    })();
  }, [categoryFromPath]);

  return (
    <div style={{ padding: 20 }}>
      <h2>
        {categoryFromPath.replace('-', ' ')}
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
            const imgUrl = `http://localhost:5000${product.image}`;

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
