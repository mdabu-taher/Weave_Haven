import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/layout.css';

export default function FeaturedProducts() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    axios.get('/api/products?limit=4')
      .then(r => setItems(r.data))
      .catch(console.error);
  }, []);
  return (
    <section className="featured">
      <h2>Featured Products</h2>
      <div className="products-grid">
        {items.map(p => (
          <div key={p._id} className="product-card">
            <img src={p.image||'/placeholder.jpg'} alt={p.name}/>
            <div className="info">
              <h3>{p.name}</h3>
              <p>${p.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
