import React from 'react';
import './Topbar.css';

const Topbar = () => {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <input type="text" placeholder="Search assets or employees..." />
      </div>
      <div className="topbar-actions">
        <div className="user-profile">
          <div className="avatar">A</div>
          <span>Admin User</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
