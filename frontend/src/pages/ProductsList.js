import React from 'react';
import '../styles/ProductsList.css';

function ProductsList() {
  const sampleProducts = [
    { id: 1, name: 'Elegant Dress', price: '$49.99' },
    { id: 2, name: 'Stylish Watch', price: '$89.99' },
    { id: 3, name: 'Luxury Handbag', price: '$129.99' },
  ];

  return (
    <div className="products-container">
      <h2>Explore Our Products</h2>

      <div className="products-grid">
        {sampleProducts.map(product => (
          <div className="product-card" key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsList;
