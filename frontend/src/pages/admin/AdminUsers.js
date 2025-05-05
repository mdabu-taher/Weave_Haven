// src/pages/admin/AdminUsers.js
import React, { useEffect, useState } from 'react';
import { fetchAdminUsers } from '../../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAdminUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
