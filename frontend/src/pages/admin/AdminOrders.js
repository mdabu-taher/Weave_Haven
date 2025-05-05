// src/pages/admin/AdminOrders.js
import React, { useEffect, useState } from 'react';
import { fetchAdminOrders } from '../../utils/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAdminOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      }
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Overview</h1>
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id} className="hover:bg-gray-50">
              <td className="p-2 border">{o._id}</td>
              <td className="p-2 border">{o.userEmail || '—'}</td>
              <td className="p-2 border">${o.total.toFixed(2)}</td>
              <td className="p-2 border">{o.status}</td>
              <td className="p-2 border">{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
