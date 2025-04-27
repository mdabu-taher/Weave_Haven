import React, { useState, useEffect } from 'react';
import { getProducts } from '../api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters] = useState({ category: '', minPrice: '', maxPrice: '' });
  const [products, setProducts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setProducts(null);
    setError('');
    getProducts(filters)
      .then(setProducts)
      .catch(() => setError('Failed to load products'));
  }, [filters]);

  return (
    <>
      <Header onToggle={() => setSidebarOpen(o => !o)} />
      <Sidebar open={sidebarOpen} />
      <main
        style={{
          marginTop: '80px',
          marginLeft: sidebarOpen ? '250px' : 0,
          padding: '0 1rem',
          transition: 'margin 0.3s'
        }}
      >
        <Hero />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!products && !error && <p>Loading…</p>}
        {products && <FeaturedProducts />}
      </main>
    </>
  );
}
