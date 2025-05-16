import React, { useState } from 'react';
import axios from 'axios';

export default function Seller() {
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    sizes: '',
    colors: '',
    material: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('image', image);
    Object.entries(form).forEach(([key, val]) => fd.append(key, val));

    try {
      const res = await axios.post('/api/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(`Uploaded product: ${res.data.name}`);
    } catch (err) {
      console.error(err);
      setMessage('Upload failed');
    }
  };

  return (
    <div>
      <h2>Upload a New Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Image:</label>
          <input type="file" name="image"
                 accept="image/*"
                 onChange={e => setImage(e.target.files[0])}
                 required />
        </div>
        <div>
          <label>Name:</label>
          <input type="text" name="name"
                 value={form.name}
                 onChange={handleChange}
                 required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" name="price"
                 value={form.price}
                 onChange={handleChange}
                 step="0.01"
                 required />
        </div>
        <div>
          <label>Category:</label>
          <input type="text" name="category"
                 value={form.category}
                 onChange={handleChange}
                 required />
        </div>
        <div>
          <label>Sizes (comma-separated):</label>
          <input type="text" name="sizes"
                 value={form.sizes}
                 onChange={handleChange}
                 placeholder="S,M,L" />
        </div>
        <div>
          <label>Colors (comma-separated):</label>
          <input type="text" name="colors"
                 value={form.colors}
                 onChange={handleChange}
                 placeholder="red,blue" />
        </div>
        <div>
          <label>Material:</label>
          <input type="text" name="material"
                 value={form.material}
                 onChange={handleChange} />
        </div>
        <button type="submit">Upload Product</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
