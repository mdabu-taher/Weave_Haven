import React, { useEffect, useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

function FavoritesPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const [validProducts, setValidProducts] = useState([]);

  useEffect(() => {
    const fetchValidProducts = async () => {
      const results = [];

      for (let item of wishlistItems) {
        try {
          const res = await axios.get(`http://localhost:5000/api/products/${item.id}`);
          results.push(res.data);
        } catch (err) {
          // Item no longer exists, optionally remove it from localStorage
          removeFromWishlist(item.id);
        }
      }

      setValidProducts(results);
    };

    fetchValidProducts();
  }, [wishlistItems, removeFromWishlist]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Favorite Items</h2>

      {validProducts.length === 0 ? (
        <p>You haven't added any favorites yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {validProducts.map(item => (
            <div key={item._id} style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              width: '200px',
              padding: '10px',
              textAlign: 'center'
            }}>
              <Link to={`/product/${item._id}`}>
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
                />
              </Link>
              <h4>{item.name}</h4>
              <p><strong>SEK{item.price}</strong></p>
              <button
                style={{ marginTop: '10px', background: 'crimson', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px' }}
                onClick={() => removeFromWishlist(item._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
