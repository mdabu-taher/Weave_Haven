import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AccountPages.css';

export default function BonusPage() {
  const [bonus, setBonus] = useState(null);

  useEffect(() => {
    axios.get('/api/bonus', { withCredentials: true })
      .then(res => setBonus(res.data))
      .catch(err => console.error('Failed to load bonus info:', err));
  }, []);

  return (
    <div className="account-container">
      <h2>Bonus Overview</h2>

      {!bonus ? (
        <p>Loading bonus details...</p>
      ) : (
        <div className="bonus-summary">
          <p><strong>Total Points Earned:</strong> {bonus.totalPoints}</p>
          <p><strong>Points Available:</strong> {bonus.availablePoints}</p>
          <p><strong>Next Reward Threshold:</strong> {bonus.nextRewardAt} points</p>
          <p><strong>Membership Tier:</strong> {bonus.tier}</p>
        </div>
      )}
    </div>
  );
}
