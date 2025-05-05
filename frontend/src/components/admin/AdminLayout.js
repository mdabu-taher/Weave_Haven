import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 p-6 bg-white border-r">
        <h2 className="text-2xl font-bold mb-6">Admin</h2>
        <nav className="space-y-4">
          <NavLink 
            to="/admin" 
            end 
            className={({ isActive }) => isActive ? 'font-bold text-pink-600' : ''}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="users" 
            className={({ isActive }) => isActive ? 'font-bold text-pink-600' : ''}
          >
            Users
          </NavLink>
          <NavLink 
            to="products" 
            className={({ isActive }) => isActive ? 'font-bold text-pink-600' : ''}
          >
            Products
          </NavLink>
          <NavLink 
            to="orders" 
            className={({ isActive }) => isActive ? 'font-bold text-pink-600' : ''}
          >
            Orders
          </NavLink>
          <NavLink 
            to="analytics" 
            className={({ isActive }) => isActive ? 'font-bold text-pink-600' : ''}
          >
            Analytics
          </NavLink>
          <NavLink 
            to="settings" 
            className={({ isActive }) => isActive ? 'font-bold text-pink-600' : ''}
          >
            Settings
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
