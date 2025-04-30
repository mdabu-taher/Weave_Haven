import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AccountPages.css';

export default function MyMembershipPage() {
  const [membership, setMembership] = useState(null);

  useEffect(() => {
    axios.get('/api/membership', { withCredentials: true })
      .then(res => setMembership(res.data))
      .catch(err => console.error('Failed to load membership info:', err));
  }, []);

  return (
    <div className="account-container">
      <h2>My Membership</h2>

      {!membership ? (
        <p>Loading membership details...</p>
      ) : (
        <div className="membership-box">
          <p><strong>Member Since:</strong> {new Date(membership.joinedAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {membership.status}</p>
          <p><strong>Points:</strong> {membership.points}</p>
          <p><strong>Level:</strong> {membership.level}</p>
        </div>
      )}
    </div>
  );
}
