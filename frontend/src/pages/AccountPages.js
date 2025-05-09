import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/AccountPages.css';

export default function AccountPages() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', address: '',
    postalCode: '', city: '', country: '',
    day: '', month: '', year: '', gender: '',
  });
  const [editField, setEditField] = useState(null);
  const [tempValues, setTempValues] = useState({});

  // Fetch profile
  useEffect(() => {
    axios.get('/api/auth/profile', { withCredentials: true })
      .then(({ data }) => {
        setUser(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          address: data.address || '',
          postalCode: data.postalCode || '',
          city: data.city || '',
          country: data.country || '',
          day: data.day || '',
          month: data.month || '',
          year: data.year || '',
          gender: data.gender || '',
        });
      })
      .catch(() => navigate('/'));
  }, [navigate]);

  const handleChange = e =>
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    await axios.put('/api/auth/profile', formData, { withCredentials: true });
    alert('Profile updated');
  };

  const handleFieldEdit = field => {
    setEditField(field);
    setTempValues(v => ({ ...v, [field]: user[field] || '' }));
  };

  const handleFieldChange = e =>
    setTempValues(v => ({ ...v, [e.target.name]: e.target.value }));

  const handleFieldSave = async field => {
    await axios.put(
      '/api/auth/profile',
      { [field]: tempValues[field] },
      { withCredentials: true }
    );
    setUser(u => ({ ...u, [field]: tempValues[field] }));
    setEditField(null);
  };

  const handleLogout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    navigate('/');
  };

  // Account detail form
  const AccountDetails = (
    <div className="account-section">
      <h2>Account Details</h2>
      <form className="account-form">
        {['firstName','lastName','address','postalCode','city','country','day','month','year'].map(name => (
          <input
            key={name}
            name={name}
            placeholder={name.replace(/([A-Z])/g,' $1').trim()}
            value={formData[name]}
            onChange={handleChange}
          />
        ))}

        <div className="gender-group">
          {['MAN','WOMAN'].map(g => (
            <label key={g}>
              <input
                type="radio"
                name="gender"
                value={g}
                checked={formData.gender === g}
                onChange={handleChange}
              />
              {g}
            </label>
          ))}
        </div>

        <button type="button" className="save-btn" onClick={handleSave}>
          SAVE CHANGES
        </button>
      </form>

      <div className="details-group">
        {[
          { label: 'E‑mail',    field: 'email',    mask: false },
          { label: 'Mobile #',  field: 'phone',    mask: false },
          { label: 'Password',  field: 'password', mask: true  },
        ].map(({ label, field, mask }) => (
          <div className="detail-item" key={field}>
            <span className="detail-label">{label}</span>
            <span className="detail-value">
              {editField === field ? (
                <input
                  name={field}
                  type={mask ? 'password' : 'text'}
                  value={tempValues[field] || ''}
                  onChange={handleFieldChange}
                />
              ) : (
                mask ? '••••••••' : user?.[field] ?? 'N/A'
              )}
            </span>
            {editField === field ? (
              <button className="detail-btn" onClick={() => handleFieldSave(field)}>Save</button>
            ) : (
              <button className="detail-btn" onClick={() => handleFieldEdit(field)}>Change</button>
            )}
          </div>
        ))}
      </div>

      <button className="logout-btn" onClick={handleLogout}>LOG OUT</button>
    </div>
  );

  // Example orders list (replace with your real data-fetch)
  const OrderHistory = (
    <div className="account-section">
      <h2>Order History</h2>
      <div className="orders-list">
        {/* Example card */}
        <div className="order-card">
          <h3>Order #12345</h3>
          <span>2 items — $49.99</span>
          <ul className="order-items">
            <li className="order-item">
              <img className="order-item-image" src="/placeholder.png" alt="Item" />
              <div className="order-item-info">
                <span className="order-item-name">Frock</span>
                <span>Qty: 1 • $24.99</span>
              </div>
            </li>
            {/* …more items */}
          </ul>
          <p className="order-total">Total: $49.99</p>
        </div>
        {/* …more order-cards */}
      </div>
    </div>
  );

  const Membership = (
    <div className="account-section">
      <h2>My Membership</h2>
      <p>Membership info coming soon.</p>
    </div>
  );

  const BonusOverview = (
    <div className="account-section">
      <h2>Bonus Overview</h2>
      <p>Bonus details will show here.</p>
    </div>
  );

  const Settings = (
    <div className="account-section">
      <h2>Settings</h2>
      <p>Settings page under construction.</p>
    </div>
  );

  // Render based on path
  let content = null;
  if (pathname === '/account') content = AccountDetails;
  else if (pathname === '/orders') content = OrderHistory;
  else if (pathname === '/membership') content = Membership;
  else if (pathname === '/bonus') content = BonusOverview;
  else if (pathname === '/settings') content = Settings;

  return <div className="account-pages account-container">{content}</div>;
}
