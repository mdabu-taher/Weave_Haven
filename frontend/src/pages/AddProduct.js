import React, { useState } from 'react';

function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sizes: '',
    colors: '',
    material: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    for (let key in formData) {
      if (key === 'sizes' || key === 'colors') {
        form.append(key, JSON.stringify(formData[key].split(',').map(v => v.trim())));
      } else if (key === 'image') {
        form.append('image', formData.image);
      } else {
        form.append(key, formData[key]);
      }
    }

    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      body: form
    });

    const result = await response.json();
    alert(result.message || 'Product uploaded!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required /><br /><br />
        <textarea name="description" placeholder="Description" onChange={handleChange} required /><br /><br />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} required /><br /><br />
        <input name="category" placeholder="Category" onChange={handleChange} /><br /><br />
        <input name="sizes" placeholder="Sizes (comma separated)" onChange={handleChange} /><br /><br />
        <input name="colors" placeholder="Colors (comma separated)" onChange={handleChange} /><br /><br />
        <input name="material" placeholder="Material" onChange={handleChange} /><br /><br />
        <input type="file" onChange={handleFileChange} required /><br /><br />
        <button type="submit">Upload Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
