// src/pages/SearchResultsPage.js
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/SearchResults.css';

// Pull in your API root (no trailing `/api`)
const API_ROOT = process.env.REACT_APP_API_BASE_URL.replace(/\/api\/?$/, '');

export default function SearchResultsPage() {
  const location = useLocation();
  const query    = new URLSearchParams(location.search).get('query') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`${API_ROOT}/api/products/search`, { params: { q: query } })
      .then(({ data }) => setResults(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="search-results">
      <h2>Results for “{query}”</h2>

      {loading ? (
        <p>Loading…</p>
      ) : results.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
          {results.map(product => {
            // pull the first photo (or fallback)
            const thumb = Array.isArray(product.photos) ? product.photos[0] : product.image;
            // build an absolute URL
            const src =
              thumb?.startsWith('http')
                ? thumb
                : `${API_ROOT}${thumb}`;

            return (
              <div key={product._id} className="product-card">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={src}
                    alt={product.name}
                    loading="lazy"
                    className="search-thumb"
                  />
                </Link>
                <h3>{product.name}</h3>
                <p>SEK {product.price.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
