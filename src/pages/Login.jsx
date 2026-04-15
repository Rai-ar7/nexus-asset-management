import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NexusLogo from '../components/NexusLogo';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Form State
  function setFormDataState() {
    return {
      name: '',
      email: '',
      password: '',
      role: 'Employee'
    };
  }

  const [form, setForm] = useState(setFormDataState());

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email: form.email, password: form.password });
        login(res.data.token, res.data.user);
        toast.success('Login Successful');
        navigate('/dashboard');
      } else {
        const res = await api.post('/auth/register', form);
        login(res.data.token, res.data.user);
        toast.success('Registration Successful');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="back-to-home" onClick={() => navigate('/')}>
        &larr; Back to Home
      </div>
      <div className="auth-header" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <NexusLogo size={32} />
      </div>

      <div className="auth-container nexus-card">
        <div className="auth-tabs">
          <button 
            className={`tab ${isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Sign In
          </button>
          <button 
            className={`tab ${!isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="Enter your full name"
                required={!isLogin} 
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              placeholder="name@company.com"
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              placeholder="••••••••"
              required 
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn-primary full-width">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span className="auth-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register here' : 'Sign in here'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
