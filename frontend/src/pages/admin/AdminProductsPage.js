// src/pages/admin/AdminProductsPage.js

import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import {
  fetchAdminProducts,
  deleteAdminProduct
} from '../../utils/api';
import '../../styles/AdminProductsPage.css';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Load admin products on mount
  useEffect(() => {
    async function load() {
      try {
        const prods = await fetchAdminProducts();
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load admin products', err);
      }
    }
    load();
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteAdminProduct(id);
      setProducts(ps => ps.filter(x => x._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="admin-page products-overview">
      <div className="page-header">
        <h2>Products Overview</h2>
        <button
          className="btn new-product-btn"
          onClick={() => navigate('new')}
        >
          + New Product
        </button>
      </div>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>In Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>SEK {p.price.toFixed(2)}</td>
                <td>{p.inStock}</td>
                <td>
                  <button
                    className="btn edit-btn"
                    onClick={() => navigate(`${p._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn delete-btn"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="nested-outlet">
        <Outlet />
      </div>
    </div>
  );
}
