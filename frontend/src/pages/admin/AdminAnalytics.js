// src/pages/admin/AdminAnalytics.js
import React, { useEffect, useState } from 'react';
import {
  fetchAdminProducts,
  fetchAdminOrders,
  fetchAdminUsers
} from '../../utils/api';

export default function AdminAnalytics() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [prods, ords, usrs] = await Promise.all([
          fetchAdminProducts(),
          fetchAdminOrders(),
          fetchAdminUsers()
        ]);
        setStats({
          products: prods.length,
          orders:   ords.length,
          users:    usrs.length
        });
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="p-6">Loading analytics…</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
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
    </div>
  );
}
