// src/pages/admin/AdminAnalytics.js
import React, { useEffect, useState } from 'react';
import {
  fetchAdminProducts,
  fetchAdminOrders,
  fetchAdminUsers,
  fetchSalesData,
  fetchTopProducts
} from '../../utils/api';
import { Line } from 'react-chartjs-2';

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats]     = useState({ products: 0, orders: 0, users: 0 });
  const [salesData, setSales] = useState({ labels: [], data: [] });
  const [topProducts, setTop] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // Parallel fetches
        const [
          prods,
          ords,
          usrs,
          salesResponse,
          topResponse
        ] = await Promise.all([
          fetchAdminProducts(),
          fetchAdminOrders(),
          fetchAdminUsers(),
          fetchSalesData(),     // { _id: '2025-05-01', total: 123.45 }[]
          fetchTopProducts()    // { name, totalSold, price }[]
        ]);

        // Summary cards
        setStats({
          products: prods.length,
          orders:   ords.length,
          users:    usrs.length
        });

        // Sales chart
        setSales({
          labels: salesResponse.map(d => d._id),
          data:   salesResponse.map(d => d.total)
        });

        // Top 5 table
        setTop(topResponse);
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="p-6">Loading analytics…</p>;
  }

  // Chart.js data object
  const chartData = {
    labels: salesData.labels,
    datasets: [
      {
        label: 'Sales ($)',
        data:  salesData.data,
        fill: false,
        tension: 0.1
      }
    ]
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded bg-white">
          <h2 className="font-medium">Products</h2>
          <p className="text-3xl">{stats.products}</p>
        </div>
        <div className="p-4 border rounded bg-white">
          <h2 className="font-medium">Orders</h2>
          <p className="text-3xl">{stats.orders}</p>
        </div>
        <div className="p-4 border rounded bg-white">
          <h2 className="font-medium">Users</h2>
          <p className="text-3xl">{stats.users}</p>
        </div>
      </div>

      {/* Sales Over Time Chart */}
      <div className="p-6 border rounded bg-white">
        <h2 className="text-xl font-medium mb-4">Sales Over Time (Last 30 Days)</h2>
        <Line data={chartData} />
      </div>

      {/* Top 5 Selling Products */}
      <div className="p-6 border rounded bg-white">
        <h2 className="text-xl font-medium mb-4">Top 5 Selling Products</h2>
        {topProducts.length ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-right">Units Sold</th>
                <th className="px-4 py-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2 text-right">{p.totalSold}</td>
                  <td className="px-4 py-2 text-right">${p.price.toFixed(2)}</td>
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
