import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './../customStyles.css';
import api from '../api';

const Signup = ({ setUser }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { username, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Client-side validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    if (username.length < 3 || username.length > 30) {
      setError('Username must be between 3 and 30 characters');
      setLoading(false);
      return;
    }
    
    try {
      const res = await api.post('/auth/signup', { username, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/create');
    } catch (err) {
      console.error('Signup error:', err);
      if (err.message && err.message.includes('Network error')) {
        setError(err.message);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred during signup');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>
        
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            required
            disabled={loading}
            placeholder="Username"
            className="auth-input"
          />
          
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            disabled={loading}
            placeholder="Email"
            className="auth-input"
          />
          
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            disabled={loading}
            placeholder="Password"
            className="auth-input"
          />
          <div className="password-hint">
            Must be at least 6 characters long
          </div>
          
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
            disabled={loading}
            placeholder="Confirm Password"
            className="auth-input"
          />
          
          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-link">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;