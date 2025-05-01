// frontend/src/pages/FavoritesPage.js
import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

function FavoritesPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Favorite Items</h2>

      {wishlistItems.length === 0 ? (
        <p>You haven't added any favorites yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {wishlistItems.map(item => (
            <div key={item.id} style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              width: '200px',
              padding: '10px',
              textAlign: 'center'
            }}>
              <Link to={`/product/${item.id}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
                />
              </Link>
              <h4>{item.name}</h4>
              <p><strong>${item.price}</strong></p>
              <button
                style={{ marginTop: '10px', background: 'crimson', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px' }}
                onClick={() => removeFromWishlist(item.id)}
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
