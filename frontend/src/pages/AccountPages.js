import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AccountPages.css';

export default function AccountPages() {
  const [section, setSection] = useState('account');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    postalCode: '',
    city: '',
    country: '',
    day: '',
    month: '',
    year: '',
    gender: '',
  });
  const [editField, setEditField] = useState(null);
  const [tempValues, setTempValues] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/auth/profile', { withCredentials: true })
      .then(({ data }) => {
        setUser(data);
        setFormData(prev => ({
          ...prev,
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
        }));
      })
      .catch(() => navigate('/'));
  }, [navigate]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await axios.put('/api/auth/profile', formData, { withCredentials: true });
    alert('Profile updated');
  };

  const handleFieldEdit = (field) => {
    setEditField(field);
    setTempValues({ ...tempValues, [field]: user?.[field] || '' });
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setTempValues({ ...tempValues, [name]: value });
  };

  const handleFieldSave = async (field) => {
    try {
      await axios.put('/api/auth/profile', { [field]: tempValues[field] }, { withCredentials: true });
      setUser(prev => ({ ...prev, [field]: tempValues[field] }));
      setEditField(null);
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderSection = () => {
    switch (section) {
      case 'account':
        return (
          <div className="account-details">
            <h2>Account details</h2>
            <form>
              <input name="firstName" placeholder="First name *" value={formData.firstName} onChange={handleChange} />
              <input name="lastName" placeholder="Last name *" value={formData.lastName} onChange={handleChange} />
              <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
              <input name="postalCode" placeholder="Postal code" value={formData.postalCode} onChange={handleChange} />
              <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
              <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
              <input name="day" placeholder="Day" value={formData.day} onChange={handleChange} />
              <input name="month" placeholder="Month" value={formData.month} onChange={handleChange} />
              <input name="year" placeholder="Year" value={formData.year} onChange={handleChange} />
              <div>
                <label><input type="radio" name="gender" value="MAN" checked={formData.gender === 'MAN'} onChange={handleChange} /> MAN</label>
                <label><input type="radio" name="gender" value="Woman" checked={formData.gender === 'Woman'} onChange={handleChange} /> Woman</label>
              </div>
            </form>
            <button className="save-btn" onClick={handleSave}>SAVE CHANGES</button>

            <div className="details-group">
              <h3>Login information</h3>
              <div className="detail-item">
                <span>E-mail</span>
                {editField === 'email' ? (
                  <>
                    <input name="email" value={tempValues.email || ''} onChange={handleFieldChange} />
                    <button onClick={() => handleFieldSave('email')}>Save</button>
                  </>
                ) : (
                  <>
                    <span>{user?.email}</span>
                    <button onClick={() => handleFieldEdit('email')}>Change</button>
                  </>
                )}
              </div>
              <div className="detail-item">
                <span>Mobile number</span>
                {editField === 'phone' ? (
                  <>
                    <input name="phone" value={tempValues.phone || ''} onChange={handleFieldChange} />
                    <button onClick={() => handleFieldSave('phone')}>Save</button>
                  </>
                ) : (
                  <>
                    <span>{user?.phone || 'N/A'}</span>
                    <button onClick={() => handleFieldEdit('phone')}>Change</button>
                  </>
                )}
              </div>
              <div className="detail-item">
                <span>Password</span>
                {editField === 'password' ? (
                  <>
                    <input name="password" type="password" value={tempValues.password || ''} onChange={handleFieldChange} />
                    <button onClick={() => handleFieldSave('password')}>Save</button>
                  </>
                ) : (
                  <>
                    <span>**************</span>
                    <button onClick={() => handleFieldEdit('password')}>Change</button>
                  </>
                )}
              </div>
            </div>

            <button className="logout-btn" onClick={handleLogout}>LOG OUT</button>
          </div>
        );

      case 'orders':
        return <div className="account-details"><h2>Order History</h2><p>No orders found.</p></div>;
      case 'membership':
        return <div className="account-details"><h2>My Membership</h2><p>Membership info coming soon.</p></div>;
      case 'bonus':
        return <div className="account-details"><h2>Bonus Overview</h2><p>Bonus details will show here.</p></div>;
      case 'settings':
        return <div className="account-details"><h2>Settings</h2><p>Settings page under construction.</p></div>;
      default:
        return null;
    }
  };

  return (
    <div className="account-pages">
      <aside className="account-sidebar">
        <ul>
          <li><button onClick={() => setSection('account')}>My account</button></li>
          <li><button onClick={() => setSection('orders')}>Order history</button></li>
          <li><button onClick={() => setSection('membership')}>My membership</button></li>
          <li><button onClick={() => setSection('bonus')}>Bonus overview</button></li>
          <li><button onClick={() => setSection('settings')}>My settings</button></li>
        </ul>
      </aside>
      {renderSection()}
    </div>
  );
}
