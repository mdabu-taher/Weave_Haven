// src/pages/SearchResultsPage.js
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/SearchResults.css';

export default function SearchResultsPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      axios.get(`/api/products/search?q=${query}`)
        .then(({ data }) => setResults(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [query]);

  return (
    <div className="search-results">
      <h2>Results for "{query}"</h2>

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
          {results.map(product => (
            <div key={product._id} className="product-card">
              <Link to={`/product/${product._id}`}>
                <img src={`http://localhost:5000${product.image}`} alt={product.name} />
              </Link>
              <h3>{product.name}</h3>
              <p>SEK{product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
