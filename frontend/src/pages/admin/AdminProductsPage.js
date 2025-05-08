// frontend/src/pages/admin/AdminProductsPage.js
import React, { useEffect, useState } from 'react';
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct
} from '../../utils/api';
import ProductForm from '../../components/admin/ProductForm';
import '../../styles/AdminProductsPage.css';
export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load products list
  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteAdminProduct(id);
      reload();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSave = async (productData) => {
    try {
      if (productData._id) {
        // Existing product: update
        await updateAdminProduct(productData._id, productData);
      } else {
        // New product: create
        await createAdminProduct(productData);
      }
      setEditing(null);
      reload();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products Overview</h1>
        <button
          onClick={() => setEditing({})}
          className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
        >
          + New Product
        </button>
      </header>

      {loading ? (
        <p>Loading products…</p>
      ) : (
        <table className="w-full bg-white rounded shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">In Stock</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">{p.category}</td>
                <td className="p-2 border">${p.price.toFixed(2)}</td>
                <td className="p-2 border">
                  {typeof p.countInStock === 'number' ? p.countInStock : '—'}
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => setEditing(p)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Product form modal */}
      {editing && (
        <ProductForm
          product={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
