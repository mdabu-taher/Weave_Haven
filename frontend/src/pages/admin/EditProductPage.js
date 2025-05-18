// src/pages/admin/EditProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import '../../styles/EditProductPage.css';

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    subCategory: '',
    material: '',
    price: '',
    salePrice: '',
    countInStock: '',
    sizes: [],
    colors: [],
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState();

  useEffect(() => {
    api.get(`/admin/products/${id}`)
      .then(res => {
        const p = res.data;
        setProduct({
          name:        p.name || '',
          description: p.description || '',
          category:    p.category || '',
          subCategory: p.subCategory || '',
          material:    p.material || '',
          price:       p.price ?? '',
          salePrice:   p.salePrice ?? '',
          countInStock:p.countInStock ?? '',
          sizes:       p.sizes || [],
          colors:      p.colors || [],
        });
      })
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (key, idx, value) => {
    setProduct(prev => {
      const arr = [...prev[key]];
      arr[idx] = value;
      return { ...prev, [key]: arr };
    });
  };

  const handleAdd = key =>
    setProduct(prev => ({ ...prev, [key]: [...prev[key], ''] }));

  const handleRemove = (key, idx) =>
    setProduct(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== idx)
    }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(product).forEach(([k,v]) => {
        if (k==='sizes' || k==='colors') form.append(k, JSON.stringify(v));
        else form.append(k, v);
      });
      Array.from(photos).forEach(file => form.append('photos', file));

      await api.put(`/admin/products/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/admin/products');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <p className="edit-product-loading">Loading…</p>;
  if (error)   return <p className="edit-product-error">Error: {error}</p>;

  return (
    <form className="edit-product-form" onSubmit={handleSubmit}>
      <h1 className="edit-product-title">Edit Product</h1>

      <label className="edit-product-label">
        Name
        <input
          name="name"
          className="edit-product-input"
          value={product.name}
          onChange={handleChange}
          required
        />
      </label>

      <label className="edit-product-label">
        Description
        <textarea
          name="description"
          className="edit-product-textarea"
          value={product.description}
          onChange={handleChange}
          rows={4}
        />
      </label>

      <label className="edit-product-label">
        Category
        <input
          name="category"
          className="edit-product-input"
          value={product.category}
          onChange={handleChange}
        />
      </label>

      <label className="edit-product-label">
        Sub-Category
        <input
          name="subCategory"
          className="edit-product-input"
          value={product.subCategory}
          onChange={handleChange}
        />
      </label>

      <label className="edit-product-label">
        Material
        <input
          name="material"
          className="edit-product-input"
          value={product.material}
          onChange={handleChange}
        />
      </label>

      <label className="edit-product-label">
        Price (SEK)
        <input
          name="price"
          type="number"
          className="edit-product-input"
          value={product.price}
          onChange={handleChange}
          step="0.01"
        />
      </label>

      <label className="edit-product-label">
        Sale Price (SEK)
        <input
          name="salePrice"
          type="number"
          className="edit-product-input"
          value={product.salePrice}
          onChange={handleChange}
          step="0.01"
        />
      </label>

      <label className="edit-product-label">
        Count In Stock
        <input
          name="countInStock"
          type="number"
          className="edit-product-input"
          value={product.countInStock}
          onChange={handleChange}
        />
      </label>

      <fieldset className="edit-product-fieldset">
        <legend className="edit-product-legend">Sizes</legend>
        {product.sizes.map((sz, i) => (
          <div key={i} className="edit-product-item-row">
            <input
              className="edit-product-array-input"
              value={sz}
              onChange={e => handleArrayChange('sizes', i, e.target.value)}
            />
            <button
              type="button"
              className="edit-product-remove-btn"
              onClick={() => handleRemove('sizes', i)}
            >×</button>
          </div>
        ))}
        <button
          type="button"
          className="edit-product-add-btn"
          onClick={() => handleAdd('sizes')}
        >+ Add Size</button>
      </fieldset>

      <fieldset className="edit-product-fieldset">
        <legend className="edit-product-legend">Colors</legend>
        {product.colors.map((clr, i) => (
          <div key={i} className="edit-product-item-row">
            <input
              type="text"
              className="edit-product-array-input"
              value={clr}
              placeholder="#ff0000 or red"
              onChange={e => handleArrayChange('colors', i, e.target.value)}
            />
            <button
              type="button"
              className="edit-product-remove-btn"
              onClick={() => handleRemove('colors', i)}
            >×</button>
          </div>
        ))}
        <button
          type="button"
          className="edit-product-add-btn"
          onClick={() => handleAdd('colors')}
        >+ Add Color</button>
      </fieldset>

      <label className="edit-product-label">
        Photos
        <input
          type="file"
          multiple
          className="edit-product-file"
          onChange={e => setPhotos(e.target.files)}
        />
      </label>

      <button
        type="submit"
        className="edit-product-submit-btn"
      >
        Save Changes
      </button>
    </form>
  );
}
