// src/pages/AddProduct.js
import React, { useState } from 'react';
import categories from '../utils/categories';
import '../styles/AddProduct.css';

const sizesByCategory = {
  Newborn: ['0-3M', '3-6M', '6-9M', '9-12M'],
  Kids: ['1Y', '2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y', '9Y', '10Y'],
  default: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
};

const inchSizes = Array.from({ length: 48 - 28 + 1 }, (_, i) => `${28 + i}`);
const allColors = [
  '#ffffff', '#000000', '#808080', '#c0c0c0', '#ff0000',
  '#ffa500', '#ffff00', '#008000', '#00ffff', '#0000ff',
  '#800080', '#ffc0cb', '#a52a2a', '#008080', '#4b0082',
];

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',      // ← NEW
    category: '',
    subCategory: '',
    sizes: [],
    colors: [],
    material: '',
    photos: [], 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { subCategory: '', sizes: [] } : {}),
      ...(name === 'subCategory' ? { sizes: [] } : {}),
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      photos: Array.from(e.target.files),
    }));
  };

  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const toggleColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.photos.length === 0) {
      return alert('Please select at least one photo.');
    }

    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('price', formData.price);
    form.append('salePrice', formData.salePrice || '');   // ← NEW
    form.append('category', formData.category);
    form.append(
      'subCategory',
      formData.subCategory.toLowerCase().replace(/\s+/g, '-')
    );
    form.append('material', formData.material);
    form.append('sizes', JSON.stringify(formData.sizes));
    form.append('colors', JSON.stringify(formData.colors));
    formData.photos.forEach(photo => form.append('photos', photo));

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: form,
      });
      const result = await res.json();
      alert(result.message || 'Product uploaded!');
      // reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        salePrice: '',     // ← RESET
        category: '',
        subCategory: '',
        sizes: [],
        colors: [],
        material: '',
        photos: [],
      });
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const subCategories =
    categories.find(c => c.name === formData.category)?.subcategories || [];

  let sizeOptions = sizesByCategory.default;
  if (
    formData.category === 'Men' &&
    /pants|shorts/i.test(formData.subCategory)
  ) {
    sizeOptions = inchSizes;
  } else if (
    formData.category === 'Women' &&
    /pants|leggings/i.test(formData.subCategory)
  ) {
    sizeOptions = inchSizes;
  } else {
    sizeOptions =
      sizesByCategory[formData.category] || sizesByCategory.default;
  }

  return (
    <div className="add-product">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Name<br />
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description<br />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Price<br />
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Sale Price (optional)<br />
          <input
            name="salePrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.salePrice}
            onChange={handleChange}
          />
        </label>

        <label>
          Category<br />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        {subCategories.length > 0 && (
          <label>
            Sub-Category<br />
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              required
            >
              <option value="">Select sub-category</option>
              {subCategories.map(sub => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="size-picker">
          <label>Available Sizes</label>
          <div className="size-grid">
            {sizeOptions.map(size => (
              <button
                type="button"
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
                className={`color-box ${
                  formData.colors.includes(color) ? 'selected' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => toggleColor(color)}
              />
            ))}
          </div>
        </div>

        <label>
          Material<br />
          <input
            name="material"
            value={formData.material}
            onChange={handleChange}
          />
        </label>

        <label>
          Photos<br />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            required
          />
        </label>

        <button type="submit" className="submit-btn">
          Upload Product
        </button>
      </form>
    </div>
  );
}
