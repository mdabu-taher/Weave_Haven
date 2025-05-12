// src/pages/admin/AdminOrders.jsx
import React, { useEffect, useState } from 'react';
import { fetchAdminOrders, updateAdminOrderStatus } from '../../utils/api';
import '../../styles/AdminOrders.css';
export default function AdminOrders() {
  // 1. State
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch orders on mount
  useEffect(() => {
    fetchAdminOrders()
      .then(data => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 3. Status change handler (here’s where you put it)
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await updateAdminOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => (o._id === orderId ? updated : o)));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="Orders">Loading orders…</p>;

  // 4. Render table
  return (
    <div className="Orders">
      <h1 className="OrdersHeadline">Order Overview</h1>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total ($)</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id} className="border-t">
              <td className="px-4 py-2">{order._id}</td>
              <td className="px-4 py-2">{order.user?.email || '—'}</td>
              <td className="px-4 py-2 text-right">
                {typeof order.totalPrice === 'number'
                  ? order.totalPrice.toFixed(2)
                  : '—'}
              </td>
              <td className="px-4 py-2">
                {/* 5. Use the handler here */}
                <select
                  value={order.status}
                  onChange={e => handleStatusChange(order._id, e.target.value)}
                  className="border rounded p-1"
                >
                  {['Confirmed','Shipped','Delivered','Canceled'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
