import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './../customStyles.css';
import api from '../api';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

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
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/create');
    } catch (err) {
      console.error('Login error:', err);
      if (err.message && err.message.includes('Network error')) {
        setError(err.message);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
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
          
          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-link">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;