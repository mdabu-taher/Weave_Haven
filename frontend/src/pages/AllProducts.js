import React, { useEffect, useState } from 'react';

function AllProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products') // automatically forwarded to backend via proxy
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Uploaded Products</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.map((product) => (
          <div key={product._id} style={{ border: '1px solid #ccc', borderRadius: '8px', width: '220px', padding: '10px' }}>
            <img
              src={`http://localhost:5000/${product.image}`}
              alt={product.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <h3 style={{ fontSize: '18px', margin: '10px 0 5px' }}>{product.name}</h3>
            <p style={{ margin: 0 }}><strong>${product.price}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllProducts;
