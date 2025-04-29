import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function AllProducts() {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  const categoryFromPath = location.pathname.replace('/', '');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (categoryFromPath && categoryFromPath !== 'new-arrivals') {
          const filtered = data.filter(
            product =>
              product.category &&
              product.category.toLowerCase() === categoryFromPath.toLowerCase()
          );
          setProducts(filtered);
        } else {
          setProducts(data);
        }
      })
      .catch(err => console.error('Error fetching products:', err));
  }, [categoryFromPath]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Products: {categoryFromPath === 'new-arrivals' ? 'All' : categoryFromPath}</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          products.map((product) => (
            <div key={product._id} style={{ border: '1px solid #ccc', borderRadius: '8px', width: '220px', padding: '10px' }}>
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <h3>{product.name}</h3>
              <p><strong>${product.price}</strong></p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AllProducts;
