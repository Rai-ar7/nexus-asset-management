import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Laptop, Users, RefreshCcw, Settings, LogOut } from 'lucide-react';
import NexusLogo from './NexusLogo';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const safeUser = user || {};
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/login');
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <NexusLogo size={24} />
        </Link>
      </div>

      <nav style={styles.nav}>
        <NavLink to="/dashboard" end style={({ isActive }) => (isActive ? { ...styles.link, ...styles.activeLink } : styles.link)}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/dashboard/assets" style={({ isActive }) => (isActive ? { ...styles.link, ...styles.activeLink } : styles.link)}>
          <Laptop size={20} />
          Assets
        </NavLink>
        <NavLink to="/dashboard/employees" style={({ isActive }) => (isActive ? { ...styles.link, ...styles.activeLink } : styles.link)}>
          <Users size={20} />
          Employees
        </NavLink>
        <NavLink to="/dashboard/assignments" style={({ isActive }) => (isActive ? { ...styles.link, ...styles.activeLink } : styles.link)}>
          <RefreshCcw size={20} />
          Assignments
        </NavLink>
        <NavLink to="/dashboard/settings" style={({ isActive }) => (isActive ? { ...styles.link, ...styles.activeLink } : styles.link)}>
          <Settings size={20} />
          Settings
        </NavLink>
      </nav>

      <div style={styles.profileCard}>
        <div style={styles.avatar}>{safeUser.name ? safeUser.name.charAt(0).toUpperCase() : 'U'}</div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <p style={styles.profileName}>{safeUser.name || 'User'}</p>
          <p style={styles.profileRole}>{safeUser.role || 'Employee'}</p>
        </div>
        <button onClick={handleLogoutClick} style={styles.logoutBtn} title="Logout">
          <LogOut size={18} color="var(--text-secondary)" />
        </button>
      </div>

      {/* Logout Modal Overlay */}
      {showLogoutModal && (
        <div style={styles.modalOverlay}>
          <div className="nexus-card" style={styles.modalContent}>
            <h3 style={{ marginBottom: '8px', fontSize: '1.2rem' }}>Log Out?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
              Are you sure you want to log out of NEXUS?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={handleCancelLogout} 
                style={{ ...styles.modalBtn, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmLogout} 
                style={{ ...styles.modalBtn, backgroundColor: 'var(--accent-red)', color: 'white' }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '240px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  logoContainer: {
    padding: '24px',
    borderBottom: '1px solid var(--border)',
  },
  nav: {
    flex: 1,
    padding: '24px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  activeLink: {
    backgroundColor: 'rgba(79, 142, 247, 0.1)',
    color: 'var(--accent-blue)',
  },
  profileCard: {
    margin: '16px',
    padding: '12px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-blue)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  profileName: {
    color: 'var(--text-primary)',
    fontWeight: 600,
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  profileRole: {
    color: 'var(--text-secondary)',
    fontSize: '0.8rem',
  },
  logoutBtn: {
    background: 'transparent',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    padding: '24px',
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
  modalBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
  }
};

export default Sidebar;
