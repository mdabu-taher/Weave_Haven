import React, { useState } from 'react';
import axios from 'axios';
import './SellerDashboard.css';

export default function SellerDashboard() {
  const [form, setForm] = useState({
    image: null,
    name: '',
    price: '',
    category: '',
    sizes: '',
    colors: '',
    material: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => data.append(key, val));
    try {
      const res = await axios.post('/api/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(`👍 Uploaded ${res.data.name}!`);
      setForm({ image: null, name: '', price: '', category: '', sizes: '', colors: '', material: '' });
    } catch (err) {
      console.error(err);
      setMessage('❌ Upload failed.');
    }
  };

  return (
    <div className="seller-dashboard">
      <h1>Upload a New Product</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Image
          <input type="file" name="image" accept="image/*" onChange={handleChange} required />
        </label>
        <label>
          Name
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Price
          <input type="number" name="price" value={form.price} onChange={handleChange} step="0.01" required />
        </label>
        <label>
          Category
          <input type="text" name="category" value={form.category} onChange={handleChange} required />
        </label>
        <label>
          Sizes <span className="hint">(comma-separated)</span>
          <input type="text" name="sizes" value={form.sizes} onChange={handleChange} />
        </label>
        <label>
          Colors <span className="hint">(comma-separated)</span>
          <input type="text" name="colors" value={form.colors} onChange={handleChange} />
        </label>
        <label>
          Material
          <input type="text" name="material" value={form.material} onChange={handleChange} />
        </label>
        <button type="submit">Upload Product</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
