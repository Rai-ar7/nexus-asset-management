import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Laptop, Users, RefreshCcw, BarChart3, Zap, Shield, TrendingUp } from 'lucide-react';
import NexusLogo from '../components/NexusLogo';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const isLoggedIn = !!(user && token);

  const handleGetStarted = () => navigate(isLoggedIn ? '/dashboard' : '/login');

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-nav">
        <NexusLogo size={32} />
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-actions">
          {isLoggedIn ? (
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          ) : (
            <>
              <button className="btn-outline" onClick={handleGetStarted}>Sign In</button>
              <button className="btn-primary" onClick={handleGetStarted}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <h1 className="title-1">Command Your Enterprise Assets</h1>
          <p className="subtitle hero-subtext">
            Track, assign, and optimize every resource in your organization from one unified platform.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary large-btn" onClick={handleGetStarted}>Get Started Free</button>
            <button className="btn-outline large-btn" onClick={handleGetStarted}>View Demo</button>
          </div>
        </div>
        <div className="hero-graphic">
          <div className="mockup-dash">
            <div className="mockup-header">
              <div className="mockup-dots"><span></span><span></span><span></span></div>
              <div className="mockup-title">NEXUS Dashboard</div>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="mockup-nav-item active"></div>
                <div className="mockup-nav-item"></div>
                <div className="mockup-nav-item"></div>
              </div>
              <div className="mockup-content">
                <div className="mockup-cards">
                  <div className="mockup-card">
                    <div className="mockup-card-title">Total Assets</div>
                    <div className="mockup-card-value">2,845</div>
                  </div>
                  <div className="mockup-card">
                    <div className="mockup-card-title">Active Employees</div>
                    <div className="mockup-card-value">892</div>
                  </div>
                </div>
                <div className="mockup-chart">
                  <div className="mockup-bar" style={{ height: '40%' }}></div>
                  <div className="mockup-bar" style={{ height: '70%' }}></div>
                  <div className="mockup-bar" style={{ height: '50%' }}></div>
                  <div className="mockup-bar" style={{ height: '90%' }}></div>
                  <div className="mockup-bar" style={{ height: '60%' }}></div>
                  <div className="mockup-bar" style={{ height: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Tiles */}
      <section id="features" className="features-section">
        <div className="features-grid">
          
          <div className="feature-tile" style={{ '--accent': 'var(--accent-blue)' }} onClick={handleGetStarted}>
            <div className="feature-icon-wrapper">
              <Laptop className="feature-icon" color="var(--accent-blue)" size={28} />
            </div>
            <h3>Asset Management</h3>
            <p>Add, track, and manage all company hardware. From laptops to servers — every asset accounted for.</p>
            <div className="tags">
              <span className="pill">Serial Numbers</span>
              <span className="pill">Categories</span>
              <span className="pill">Status Tracking</span>
            </div>
            <button className="btn-outline tile-btn">Manage Assets</button>
          </div>

          <div className="feature-tile" style={{ '--accent': 'var(--accent-cyan)' }} onClick={handleGetStarted}>
            <div className="feature-icon-wrapper">
              <Users className="feature-icon" color="var(--accent-cyan)" size={28} />
            </div>
            <h3>Employee Management</h3>
            <p>Maintain a complete employee directory with department and role tracking for proper asset ownership.</p>
            <div className="tags">
              <span className="pill">Departments</span>
              <span className="pill">Roles</span>
              <span className="pill">Contact Info</span>
            </div>
            <button className="btn-outline tile-btn">View Employees</button>
          </div>

          <div className="feature-tile" style={{ '--accent': 'var(--accent-green)' }} onClick={handleGetStarted}>
            <div className="feature-icon-wrapper">
              <RefreshCcw className="feature-icon" color="var(--accent-green)" size={28} />
            </div>
            <h3>Asset Assignment</h3>
            <p>Assign assets to employees instantly. Track who holds what and when, with full assignment history.</p>
            <div className="tags">
              <span className="pill">Live Status</span>
              <span className="pill">History</span>
              <span className="pill">One-Click Return</span>
            </div>
            <button className="btn-outline tile-btn">Assign Now</button>
          </div>

          <div className="feature-tile" style={{ '--accent': 'var(--accent-amber)' }} onClick={handleGetStarted}>
            <div className="feature-icon-wrapper">
              <BarChart3 className="feature-icon" color="var(--accent-amber)" size={28} />
            </div>
            <h3>Analytics Overview</h3>
            <p>Real-time KPIs, asset utilization charts, and department-wise breakdowns at a glance.</p>
            <div className="tags">
              <span className="pill">KPI Cards</span>
              <span className="pill">Charts</span>
              <span className="pill">Reports</span>
            </div>
            <button className="btn-outline tile-btn">View Dashboard</button>
          </div>

        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-divider"></div>
      <section className="stats-bar">
        <div className="stat-item">
          <h2>500+</h2>
          <p>Assets Tracked</p>
        </div>
        <div className="stat-item">
          <h2>200+</h2>
          <p>Employees</p>
        </div>
        <div className="stat-item">
          <h2>98%</h2>
          <p>Uptime</p>
        </div>
        <div className="stat-item">
          <h2>15+</h2>
          <p>Departments</p>
        </div>
      </section>

      {/* Why NEXUS Section */}
      <section id="about" className="why-nexus-section">
        <div className="why-content">
          <h2 className="title-2">Built for how modern enterprises actually work</h2>
          <p className="why-body">
            NEXUS centralizes your entire asset lifecycle — from procurement to decommission — giving your IT and HR teams one source of truth.
          </p>
        </div>
        <div className="why-highlights">
          <div className="highlight-card">
            <Zap className="hl-icon" color="var(--accent-amber)" size={24} />
            <div>
              <h4>Real-Time Tracking</h4>
              <p>Know exactly where every asset is at any moment.</p>
            </div>
          </div>
          <div className="highlight-card">
            <Shield className="hl-icon" color="var(--accent-blue)" size={24} />
            <div>
              <h4>Centralized Control</h4>
              <p>One platform for IT, HR, and management.</p>
            </div>
          </div>
          <div className="highlight-card">
            <TrendingUp className="hl-icon" color="var(--accent-green)" size={24} />
            <div>
              <h4>Efficient Allocation</h4>
              <p>Reduce waste, improve resource utilization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-col brand-col">
            <NexusLogo size={24} />
            <p className="tagline">Command Your Enterprise Assets.</p>
            <p className="copyright">© 2025 NEXUS. All rights reserved.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">Dashboard</a>
            <a href="#">Analytics</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
          </div>
          <div className="footer-col">
            <h4>Team</h4>
            <p>Built by Antigravity</p>
            <p>VTU FSD Mini Project</p>
            <p>Contact: admin@nexus.local</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Made by Rakshitha &amp; Rachan as part of FSD Mini Project | MERN Stack</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
