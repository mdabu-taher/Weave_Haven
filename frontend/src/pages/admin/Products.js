import { useEffect, useState } from 'react';
import {
  fetchAdminProducts,
  deleteAdminProduct
} from '../../utils/api';
import ProductForm from '../../components/admin/ProductForm';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    reload();
  }, []);

  function reload() {
    fetchAdminProducts().then(r => setProducts(r.data));
  }

  function onDelete(id) {
    if (confirm('Delete this product?')) {
      deleteAdminProduct(id).then(reload);
    }
  }

  return (
    <div>
      <h1>Products</h1>
      <button onClick={() => setEditing({})}>+ New Product</button>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Price</th><th>Category</th><th>In Stock</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.category}</td>
              <td>{p.inStock ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => setEditing(p)}>Edit</button>
                <button onClick={() => onDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <ProductForm
          product={editing}
          onSuccess={() => { setEditing(null); reload(); }}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
