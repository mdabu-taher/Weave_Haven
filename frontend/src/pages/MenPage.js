// src/pages/MenPage.js
import React, { useEffect, useState } from 'react';
import api from '../api';

export default function MenPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await api.get('/products', { params: { category: 'men' } });
      setProducts(data);
    })();
  }, []);

  // render products or “No products” as you already have
}
