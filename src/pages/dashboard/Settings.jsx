import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user: authUser, token, login } = useAuth();
  const [user, setUser] = useState({ name: '', email: '' });

  useEffect(() => {
    const localUser = authUser || {};
    setUser({
      name: localUser.name || '',
      email: localUser.email || ''
    });
  }, [authUser]);

  const handleSave = (e) => {
    e.preventDefault();
    // Usually would call an API like PUT /api/auth/profile
    const updatedUser = { ...(authUser || {}), name: user.name, email: user.email };
    login(token, updatedUser);
    toast.success('Profile updated successfully');
  };

  return (
    <div>
      <h2 className="title-2" style={{ marginBottom: '32px' }}>Settings</h2>

      <div style={styles.grid}>
        <div className="nexus-card" style={styles.card}>
          <h3 style={styles.sectionTitle}>Profile Settings</h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={styles.label}>Full Name</label>
              <input 
                type="text" 
                value={user.name} 
                onChange={e => setUser({...user, name: e.target.value})} 
              />
            </div>
            <div>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" 
                value={user.email} 
                onChange={e => setUser({...user, email: e.target.value})} 
              />
            </div>
            <div>
              <label style={styles.label}>Change Password</label>
              <input 
                type="password" 
                placeholder="Leave blank to keep current" 
              />
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
              Save Changes
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="nexus-card" style={styles.card}>
            <h3 style={styles.sectionTitle}>System Information</h3>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>App Version</span>
              <span style={styles.infoValue}>1.0.0 (FSD Mini Project)</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Database Status</span>
              <span style={styles.infoValue} className="badge available">Connected</span>
            </div>
          </div>

          <div className="nexus-card" style={styles.card}>
            <h3 style={styles.sectionTitle}>Appearance</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={styles.infoLabel}>Dark Mode</span>
              <label style={styles.toggle}>
                <input type="checkbox" checked readOnly />
                <span style={styles.slider}></span>
              </label>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              NEXUS is exclusively designed in dark mode.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px'
  },
  card: {
    padding: '24px'
  },
  sectionTitle: {
    fontSize: '1.2rem',
    marginBottom: '20px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '12px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid var(--border)'
  },
  infoLabel: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem'
  },
  infoValue: {
    fontWeight: 500
  },
  toggle: {
    position: 'relative',
    display: 'inline-block',
    width: '40px',
    height: '24px'
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'var(--accent-blue)',
    transition: '.4s',
    borderRadius: '24px'
  }
};

export default Settings;
