import React, { useState, useEffect } from 'react';
import api from '../utils/api';               // ← use your configured instance
import { useNavigate } from 'react-router-dom';
import '../styles/AccountPages.css';

export default function AccountPages() {
  const [section, setSection] = useState('account');
  const [user, setUser]       = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    address:  ''
  });
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/profile')                 // ← not axios.get(...)
      .then(({ data }) => {
        setUser(data);
        setFormData({
          fullName: data.fullName || '',
          address:  data.address  || ''
        });
      })
      .catch(() => navigate('/'));
  }, [navigate]);

  const handleFormChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const saveAccountDetails = async () => {
    await api.put('/auth/profile', formData);
    alert('Account details saved');
    setUser(prev => ({ ...prev, ...formData }));
  };

  const startEdit = field => {
    setTempValue(user[field] || '');
    setEditField(field);
  };
  const saveField = async field => {
    await api.put('/auth/profile', { [field]: tempValue });
    setUser(prev => ({ ...prev, [field]: tempValue }));
    setEditField(null);
  };

  const handleLogout = async () => {
    await api.post('/auth/logout');
    navigate('/');
  };

  const renderSection = () => {
    if (section === 'account') {
      return (
        <div className="account-details">
          <h2>Account Details</h2>

          <label>
            Name
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleFormChange}
            />
          </label>
          <label>
            Address
            <input
              name="address"
              value={formData.address}
              onChange={handleFormChange}
            />
          </label>

          <button className="save-btn" onClick={saveAccountDetails}>
            Save Changes
          </button>

          <div className="details-group">
            <h3>Login Information</h3>

            <div className="detail-item">
              <span>Email</span>
              {editField === 'email' ? (
                <>
                  <input
                    value={tempValue}
                    onChange={e => setTempValue(e.target.value)}
                  />
                  <button onClick={() => saveField('email')}>Save</button>
                </>
              ) : (
                <>
                  <span>{user.email}</span>
                  <button onClick={() => startEdit('email')}>
                    Change
                  </button>
                </>
              )}
            </div>

            <div className="detail-item">
              <span>Phone</span>
              {editField === 'phone' ? (
                <>
                  <input
                    value={tempValue}
                    onChange={e => setTempValue(e.target.value)}
                  />
                  <button onClick={() => saveField('phone')}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span>{user.phone || 'N/A'}</span>
                  <button onClick={() => startEdit('phone')}>
                    Change
                  </button>
                </>
              )}
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      );
    }

    return (
      <div className="account-details">
        <h2>
          {section === 'orders' && 'Order History'}
          {section === 'membership' && 'Membership'}
          {section === 'bonus' && 'Bonus Overview'}
          {section === 'settings' && 'Settings'}
        </h2>
        <p>Coming soon…</p>
      </div>
    );
  };

  return (
    <div className="account-pages">
      <aside className="account-sidebar">
        <ul>
          <li>
            <button onClick={() => setSection('account')}>Account</button>
          </li>
          <li>
            <button onClick={() => setSection('orders')}>
              Order history
            </button>
          </li>
          <li>
            <button onClick={() => setSection('membership')}>
              Membership
            </button>
          </li>
          <li>
            <button onClick={() => setSection('bonus')}>
              Bonus overview
            </button>
          </li>
          <li>
            <button onClick={() => setSection('settings')}>
              Settings
            </button>
          </li>
        </ul>
      </aside>

      {user && renderSection()}
    </div>
  );
}
