// frontend/src/pages/admin/AdminDashboard.js
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
  fetchAdminProducts,
  fetchAdminOrders,
  fetchAdminUsers
} from '../../utils/api';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  // Debug: verify we have the user and their role
  useEffect(() => {
    console.log('AdminDashboard sees user:', user);
  }, [user]);

  const [stats, setStats] = useState({
    products: 0,
    orders:   0,
    users:    0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [prods, ords, usrs] = await Promise.all([
          fetchAdminProducts(),
          fetchAdminOrders(),
          fetchAdminUsers()
        ]);
        setStats({
          products: prods.length,
          orders:   ords.length,
          users:    usrs.length,
        });
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded bg-white">
          <h2 className="text-lg font-medium">Products</h2>
          <p className="text-3xl">{stats.products}</p>
        </div>
        <div className="p-4 border rounded bg-white">
          <h2 className="text-lg font-medium">Orders</h2>
          <p className="text-3xl">{stats.orders}</p>
        </div>
        <div className="p-4 border rounded bg-white">
          <h2 className="text-lg font-medium">Users</h2>
          <p className="text-3xl">{stats.users}</p>
        </div>
      </div>
    </div>
  );
}
