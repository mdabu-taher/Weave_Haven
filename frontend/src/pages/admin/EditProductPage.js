// src/pages/admin/EditProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    api.get(`/admin/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.put(`/admin/products/${id}`, product, { 
        headers: { 'Content-Type': 'application/json' }
      });
      navigate('/admin/products');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Product</h1>
      <label>
        Name:
        <input
          value={product.name}
          onChange={e => setProduct({ ...product, name: e.target.value })}
        />
      </label>
      {/* repeat for price, description, etc. */}
      <button type="submit">Save Changes</button>
    </form>
  );
}
