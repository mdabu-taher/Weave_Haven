import React, { useState } from 'react';
import categories from '../utils/categories';
import {
  createAdminProduct
} from '../utils/api';
import '../styles/AddProduct.css';

const sizesByCategory = {
  Newborn: ['0-3M','3-6M','6-9M','9-12M'],
  Kids:     ['1Y','2Y','3Y','4Y','5Y','6Y','7Y','8Y','9Y','10Y'],
  default:  ['XXS','XS','S','M','L','XL','XXL','XXXL']
};
const inchSizes = Array.from({ length: 21 }, (_, i) => `${28 + i}`);
const allColors = [
  '#ffffff','#000000','#808080','#c0c0c0','#ff0000',
  '#ffa500','#ffff00','#008000','#00ffff','#0000ff',
  '#800080','#ffc0cb','#a52a2a','#008080','#4b0082'
];

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    category: '',
    subCategory: '',
    sizes: [],
    colors: [],
    material: '',
    photos: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({
      ...f,
      [name]: value,
      ...(name === 'category' ? { subCategory: '', sizes: [] } : {}),
      ...(name === 'subCategory' ? { sizes: [] } : {})
    }));
  };

  const handleFileChange = e => {
    setFormData(f => ({
      ...f,
      photos: Array.from(e.target.files)
    }));
  };

  const toggleSize = size => {
    setFormData(f => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter(s => s !== size)
        : [...f.sizes, size]
    }));
  };

  const toggleColor = color => {
    setFormData(f => ({
      ...f,
      colors: f.colors.includes(color)
        ? f.colors.filter(c => c !== color)
        : [...f.colors, color]
    }));
  };

  const subCategories =
    categories.find(c => c.name === formData.category)?.subcategories || [];

  let sizeOptions = sizesByCategory.default;
  if (formData.category === 'Men' && /pants|shorts/i.test(formData.subCategory)) {
    sizeOptions = inchSizes;
  } else if (formData.category === 'Women' && /pants|leggings/i.test(formData.subCategory)) {
    sizeOptions = inchSizes;
  } else {
    sizeOptions = sizesByCategory[formData.category] || sizesByCategory.default;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.photos.length) {
      setError('Please select at least one photo.');
      return;
    }

    // Build FormData
    const payload = new FormData();
    payload.append('name',        formData.name);
    payload.append('description', formData.description);
    payload.append('price',       formData.price);
    if (formData.salePrice) {
      payload.append('salePrice', formData.salePrice);
    }
    payload.append('category',    formData.category);
    payload.append(
      'subCategory',
      formData.subCategory.toLowerCase().replace(/\s+/g,'-')
    );
    payload.append('material',    formData.material);
    payload.append('sizes',       JSON.stringify(formData.sizes));
    payload.append('colors',      JSON.stringify(formData.colors));
    formData.photos.forEach(file => payload.append('photos', file));

    try {
      await createAdminProduct(payload);
      setSuccess('Product uploaded successfully!');
      // reset form
      setFormData({
        name: '', description: '', price: '', salePrice: '',
        category: '', subCategory: '', sizes: [], colors: [],
        material: '', photos: []
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="add-product">
      <h2>Add New Product</h2>

      {error   && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Name<br/>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description<br/>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Price<br/>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Sale Price (optional)<br/>
          <input
            name="salePrice"
            type="number"
            value={formData.salePrice}
            onChange={handleChange}
          />
        </label>

        <label>
          Category<br/>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(c => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        {subCategories.length > 0 && (
          <label>
            Sub-Category<br/>
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
            {sizeOptions.map(sz => (
              <button
                key={sz}
                type="button"
                className={formData.sizes.includes(sz) ? 'selected' : ''}
                onClick={() => toggleSize(sz)}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        <div className="color-picker">
          <label>Available Colors</label>
          <div className="color-grid">
            {allColors.map(clr => (
              <div
                key={clr}
                className={`color-box ${formData.colors.includes(clr) ? 'selected' : ''}`}
                style={{ backgroundColor: clr }}
                onClick={() => toggleColor(clr)}
              />
            ))}
          </div>
        </div>

        <label>
          Material<br/>
          <input
            name="material"
            value={formData.material}
            onChange={handleChange}
          />
        </label>

        <label>
          Photos<br/>
          <input
            name="photos"
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
