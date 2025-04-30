import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AccountPages.css';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [emailPref, setEmailPref] = useState(true);

  useEffect(() => {
    axios.get('/api/auth/profile', { withCredentials: true })
      .then(({ data }) => {
        setUser(data);
        setEmailPref(data.emailNotifications ?? true);
      })
      .catch(() => setUser(null));
  }, []);

  const handleToggleEmailPref = async () => {
    try {
      const updatedPref = !emailPref;
      setEmailPref(updatedPref);
      await axios.patch('/api/settings/email-preference', { enabled: updatedPref }, { withCredentials: true });
    } catch (err) {
      console.error('Failed to update preference:', err);
    }
  };

  if (!user) return <div className="account-container">Please log in to view settings.</div>;

  return (
    <div className="account-container">
      <h2>My Settings</h2>

      <div className="settings-section">
        <h3>Email Notifications</h3>
        <label className="switch">
          <input type="checkbox" checked={emailPref} onChange={handleToggleEmailPref} />
          <span className="slider round"></span>
        </label>
        <p>{emailPref ? 'You will receive email updates.' : 'Email updates are turned off.'}</p>
      </div>
    </div>
  );
}
