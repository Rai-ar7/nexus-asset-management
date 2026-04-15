import React from 'react';

const NexusLogo = ({ size = 28 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        {/* Horizontal orbit ring */}
        <ellipse cx="20" cy="20" rx="18" ry="7" stroke="#4f8ef7" strokeWidth="1.8" opacity="0.6"/>
        {/* Vertical orbit ring */}
        <ellipse cx="20" cy="20" rx="7" ry="18" stroke="#00d4ff" strokeWidth="1.8" opacity="0.6"/>
        {/* Core node */}
        <circle cx="20" cy="20" r="3.5" fill="#4f8ef7"/>
        {/* Satellite dot — top of vertical ring */}
        <circle cx="20" cy="2" r="2.5" fill="#00d4ff"/>
      </svg>
      <span style={{
        fontFamily: "'Sora', 'DM Sans', sans-serif",
        fontWeight: 700,
        fontSize: size * 0.65,
        letterSpacing: '3px',
        color: '#f0f0f8'
      }}>NEXUS</span>
    </div>
  );
};

export default NexusLogo;
