// src/components/FilterPanel.js
import React, { useEffect, useState } from 'react';
import { getCategories, getSizes, getColors } from '../api';

export default function FilterPanel({ onChange }) {
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes]           = useState([]);
  const [colors, setColors]         = useState([]);

  const [local, setLocal] = useState({
    category: '',
    sizes: [],
    colors: [],
    minPrice: '',
    maxPrice: '',
  });

  // load options once
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
    getSizes().then(setSizes).catch(console.error);
    getColors().then(setColors).catch(console.error);
  }, []);

  // whenever local changes, bubble up
  useEffect(() => {
    onChange(local);
  }, [local, onChange]);

  const toggle = (field, value) => {
    setLocal(prev => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter(x => x !== value)
          : [...arr, value],
      };
    });
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div>
        <label>Category</label>
        <select
          value={local.category}
          onChange={e => setLocal({ ...local, category: e.target.value })}
        >
          <option value="">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend>Sizes</legend>
        {sizes.map(sz => (
          <label key={sz}>
            <input
              type="checkbox"
              checked={local.sizes.includes(sz)}
              onChange={() => toggle('sizes', sz)}
            />
            {sz}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Colors</legend>
        {colors.map(col => (
          <label key={col}>
            <input
              type="checkbox"
              checked={local.colors.includes(col)}
              onChange={() => toggle('colors', col)}
            />
            {col}
          </label>
        ))}
      </fieldset>

      <div>
        <label>Min Price</label>
        <input
          type="number"
          value={local.minPrice}
          onChange={e => setLocal({ ...local, minPrice: e.target.value })}
        />
      </div>

      <div>
        <label>Max Price</label>
        <input
          type="number"
          value={local.maxPrice}
          onChange={e => setLocal({ ...local, maxPrice: e.target.value })}
        />
      </div>
    </div>
  );
}
