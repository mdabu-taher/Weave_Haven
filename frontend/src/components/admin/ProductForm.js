// src/components/admin/ProductForm.js
import React, { useState, useEffect } from 'react';

export default function ProductForm({ product = {}, onSave, onCancel }) {
  // initialize fields (existing product or blank for new)
  const [form, setForm] = useState({
    name:        '',
    category:    '',
    price:       0,
    countInStock: 0,
    description: '',
    ...product
  });

  // If the `product` prop changes (e.g. you switch from edit to new), update the form
  useEffect(() => {
    setForm({
      name:        product.name || '',
      category:    product.category || '',
      price:       product.price || 0,
      countInStock: product.countInStock || 0,
      description: product.description || '',
      _id:         product._id // might be undefined for new
    });
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'price' || name === 'countInStock'
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">
          {form._id ? 'Edit Product' : 'New Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Price ($)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">In Stock</label>
            <input
              name="countInStock"
              type="number"
              value={form.countInStock}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
