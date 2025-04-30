// frontend/src/pages/AllProducts.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const categoryFromPath = location.pathname.replace('/', '');

  useEffect(() => {
    (async () => {
      try {
        // 1) Fetch the product list from your backend
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();

        console.log('✅ Loaded products:', data);
        // Inspect the console: data[i].image should be "/uploads/<filename.ext>"

        // 2) Filter client-side by category if needed
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
        Products:{' '}
        {categoryFromPath === 'new-arrivals'
          ? 'All'
          : categoryFromPath}
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
            console.log('→ Attempting to load image:', imgUrl);

            return (
              <div
                key={product._id}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  width: 220,
                  padding: 10
                }}
              >
                {/* 3) This <img> will now attempt to fetch the URL you logged above */}
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
                  <strong>${product.price}</strong>
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
