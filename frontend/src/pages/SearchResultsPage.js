// src/pages/SearchResultsPage.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/SearchResults.css';

export default function SearchResultsPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      axios.get(`/api/products`)
        .then(({ data }) => {
          const filtered = data.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
          );
          setResults(filtered);
        })
        .catch(console.error);
    }
  }, [query]);

  return (
    <div className="search-results">
      <h2>Results for "{query}"</h2>
      <div className="product-grid">
        {results.map(product => (
          <div key={product._id} className="product-card">
            <img src={`/uploads/${product.image}`} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
        {results.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  );
}
