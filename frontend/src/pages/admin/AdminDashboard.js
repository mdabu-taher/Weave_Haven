import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchAdminStats } from '../../utils/api';
import '../../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchAdminStats();
        // data = { productCount, orderCount, userCount, salesData: [ { total }, ... ] }
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <p className="p-6">Loading dashboard…</p>;
  }

  // Sum total sales across the salesData array
  const totalSales = stats.salesData
    .reduce((sum, { total }) => sum + total, 0)
    .toFixed(2);

  const cards = [
    { label: 'Products', count: stats.productCount },
    { label: 'Orders',   count: stats.orderCount },
    { label: 'Users',    count: stats.userCount },
    { label: 'Sales (SEK)',count: totalSales },
  ];

  return (
    <div className="admin-dashboard space-y-6">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="dashboard-grid">
        {cards.map(({ label, count }) => (
          <div key={label} className="dashboard-card">
            <h2 className="card-label">{label}</h2>
            <p className="card-count">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}