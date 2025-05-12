// src/pages/admin/AdminAnalytics.jsx

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchAdminStats, fetchTopProducts } from '../../utils/api';
import '../../styles/AdminAnalytics.css';

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [stats, setStats]     = useState({
    productCount: 0,
    orderCount:   0,
    userCount:    0,
    salesData:    []
  });
  const [topProducts, setTop] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, topRes] = await Promise.all([
          fetchAdminStats(),
          fetchTopProducts()
        ]);
        setStats(statsRes);
        setTop(topRes);
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError('Unable to load analytics. Please try again later.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="analytics-loading">Loading analytics…</p>;
  }
  if (error) {
    return <p className="analytics-error">{error}</p>;
  }

  const labels = stats.salesData.map(d => d.date);
  const dataPoints = stats.salesData.map(d => d.total);
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Sales (SEK)',
        data: dataPoints,
        fill: false,
        tension: 0.1
      }
    ]
  };

  return (
    <div className="analytics-dashboard">
      <h1 className="analytics-title">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="stats-grid">
        {[
          { label: 'Products', count: stats.productCount },
          { label: 'Orders',   count: stats.orderCount },
          { label: 'Users',    count: stats.userCount }
        ].map(({ label, count }) => (
          <div key={label} className="stat-card">
            <h2 className="stat-label">{label}</h2>
            <p className="stat-value">{count}</p>
          </div>
        ))}
      </div>

      {/* Sales Over Time Chart */}
      <section className="chart-section">
        <h2 className="chart-title">Sales Over Time (Last 30 Days)</h2>
        {labels.length > 0 ? (
          <Line data={chartData} className="sales-chart" />
        ) : (
          <p className="no-data">No sales data available.</p>
        )}
      </section>

      {/* Top 5 Selling Products */}
      <section className="top-products-section">
        <h2 className="section-title">Top 5 Selling Products</h2>
        {topProducts.length > 0 ? (
          <table className="products-table">
            <thead>
              <tr className="table-header-row">
                <th className="table-header-cell">Product</th>
                <th className="table-header-cell">Units Sold</th>
                <th className="table-header-cell">Price</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map(p => (
                <tr key={p.productId} className="table-body-row">
                  <td className="table-body-cell">{p.name}</td>
                  <td className="table-body-cell">{p.totalSold}</td>
                  <td className="table-body-cell">SEK {p.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No product sales yet.</p>
        )}
      </section>
    </div>
  );
}
