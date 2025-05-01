import React, { useState } from 'react';
import '../styles/AddProduct.css';

const allSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const allColors = [
  '#ffffff', '#000000', '#808080', '#c0c0c0', '#ff0000',
  '#ffa500', '#ffff00', '#008000', '#00ffff', '#0000ff',
  '#800080', '#ffc0cb', '#a52a2a', '#008080', '#4b0082'
];

function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sizes: [],
    colors: [],
    material: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const toggleColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('price', formData.price);
    form.append('category', formData.category);
    form.append('material', formData.material);
    form.append('sizes', JSON.stringify(formData.sizes));
    form.append('colors', JSON.stringify(formData.colors));
    form.append('image', formData.image);

    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      body: form,
    });

    const result = await response.json();
    alert(result.message || 'Product uploaded!');
  };

  return (
    <div className="add-product">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <label>Name<br/>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>Description<br/>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>

        <label>Price<br/>
          <input name="price" type="number" value={formData.price} onChange={handleChange} required />
        </label>

        <label>Category<br/>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select category</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
            <option value="teens">Teens</option>
            <option value="newborn">Newborn</option>
            <option value="new-arrivals">New Arrivals</option>
            <option value="sale">Sale</option>
          </select>
        </label>

        <div className="size-picker">
          <label>Available Sizes</label>
          <div className="size-grid">
            {allSizes.map(size => (
              <button type="button"
                key={size}
                className={formData.sizes.includes(size) ? 'selected' : ''}
                onClick={() => toggleSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="color-picker">
          <label>Available Colors</label>
          <div className="color-grid">
            {allColors.map(color => (
              <div
                key={color}
                className={`color-box ${formData.colors.includes(color) ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => toggleColor(color)}
              />
            ))}
          </div>
        </div>

        <label>Material<br/>
          <input name="material" value={formData.material} onChange={handleChange} />
        </label>

        <label>Image<br/>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
        </label>

        <button type="submit" className="submit-btn">Upload Product</button>
      </form>
    </div>
  );
}

export default AddProduct;