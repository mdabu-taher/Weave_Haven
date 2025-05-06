// src/pages/admin/AdminAnalytics.js

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchAdminStats, fetchTopProducts } from '../../utils/api';

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
          fetchAdminStats(),      // { productCount, orderCount, userCount, salesData }
          fetchTopProducts()      // [ { productId, name, totalSold, price }, … ]
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
    return <p className="p-6">Loading analytics…</p>;
  }
  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  // Prepare chart data, guard empty array
  const labels = stats.salesData.map(d => d.date);
  const dataPoints = stats.salesData.map(d => d.total);
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Sales ($)',
        data: dataPoints,
        fill: false,
        tension: 0.1
      }
    ]
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Products', count: stats.productCount },
          { label: 'Orders',   count: stats.orderCount },
          { label: 'Users',    count: stats.userCount }
        ].map(({ label, count }) => (
          <div key={label} className="p-4 border rounded bg-white">
            <h2 className="font-medium">{label}</h2>
            <p className="text-3xl">{count}</p>
          </div>
        ))}
      </div>

      {/* Sales Over Time Chart */}
      <div className="p-6 border rounded bg-white">
        <h2 className="text-xl font-medium mb-4">
          Sales Over Time (Last 30 Days)
        </h2>
        {labels.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p>No sales data available.</p>
        )}
      </div>

      {/* Top 5 Selling Products */}
      <div className="p-6 border rounded bg-white">
        <h2 className="text-xl font-medium mb-4">
          Top 5 Selling Products
        </h2>
        {topProducts.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-right">Units Sold</th>
                <th className="px-4 py-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map(p => (
                <tr key={p.productId} className="border-t">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2 text-right">{p.totalSold}</td>
                  <td className="px-4 py-2 text-right">
                    ${p.price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No product sales yet.</p>
        )}
      </div>
    </div>
  );
}
