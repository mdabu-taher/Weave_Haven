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
    image: null,
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
    Object.entries(formData).forEach(([key, val]) => {
      if (key === 'sizes' || key === 'colors') {
        // split comma list into JSON array
        const arr = val
          .split(',')
          .map(v => v.trim())
          .filter(v => v);
        form.append(key, JSON.stringify(arr));
      } else if (key === 'image') {
        form.append('image', val);
      } else {
        form.append(key, val);
      }
    });

    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      body: form,
    });

    const result = await response.json();
    alert(result.message || 'Product uploaded!');
    // Optionally reset form:
    // setFormData({ name:'',description:'',price:'',category:'',sizes:'',colors:'',material:'',image:null });
  };

  return (
    <div style={{ padding: '20px', maxWidth: 600, margin: 'auto' }}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name<br/>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <br /><br />

        <label>
          Description<br/>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <br /><br />

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
        <br /><br />

        <label>
          Category<br/>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
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
        <br /><br />

        <label>
          Sizes (comma separated)<br/>
          <input
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            placeholder="e.g. S, M, L"
          />
        </label>
        <br /><br />

        <label>
          Colors (comma separated)<br/>
          <input
            name="colors"
            value={formData.colors}
            onChange={handleChange}
            placeholder="e.g. red, blue, black"
          />
        </label>
        <br /><br />

        <label>
          Material<br/>
          <input
            name="material"
            value={formData.material}
            onChange={handleChange}
          />
        </label>
        <br /><br />

        <label>
          Image<br/>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </label>
        <br /><br />

        <button type="submit" style={{ padding: '10px 20px' }}>
          Upload Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
