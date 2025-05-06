import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchAdminStats } from '../../utils/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AdminDashboard sees user:', user);
  }, [user]);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchAdminStats();
        // data = { productCount, orderCount, userCount, salesData: [{ _id:'2025-05-01', total:123 }, …] }
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
    return <p>Loading dashboard…</p>;
  }

  // prepare chart data
  const chartData = {
    labels: stats.salesData.map(d => d._id),
    datasets: [
      {
        label: 'Sales',
        data: stats.salesData.map(d => d.total),
        fill: false,
        tension: 0.4
      }
    ]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded bg-white">
          <h2 className="text-lg font-medium">Products</h2>
          <p className="text-3xl">{stats.productCount}</p>
        </div>
        <div className="p-4 border rounded bg-white">
          <h2 className="text-lg font-medium">Orders</h2>
          <p className="text-3xl">{stats.orderCount}</p>
        </div>
        <div className="p-4 border rounded bg-white">
          <h2 className="text-lg font-medium">Users</h2>
          <p className="text-3xl">{stats.userCount}</p>
        </div>
      </div>

      <div className="p-4 border rounded bg-white">
        <h2 className="text-lg font-medium mb-2">Sales (Last 30 Days)</h2>
        <Line data={chartData} />
      </div>
    </div>
  );
}
