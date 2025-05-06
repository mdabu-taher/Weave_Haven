// frontend/src/components/admin/TopProductsReport.jsx
import React, { useEffect, useState } from 'react';
import { fetchTopProducts } from '../../services/adminApi';

export default function TopProductsReport() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchTopProducts().then(setProducts);
  }, []);

  if (!products.length) return <p>No sales data yet.</p>;

  return (
    <div>
      <h2>Top 5 Selling Products</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Units Sold</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.productId}>
              <td>{p.name}</td>
              <td>{p.totalSold}</td>
              <td>${p.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
