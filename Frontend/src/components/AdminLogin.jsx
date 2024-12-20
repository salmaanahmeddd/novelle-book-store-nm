import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { setAdminToken } from '../utils/storage'; // Updated import
import '../App.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/login`,
        { email, password },
        { withCredentials: true } // Ensures cookies are sent cross-origin
      );

      if (response.status === 200) {
        const { token } = response.data;
        console.log('Login successful. Token received:', token); // Debugging log
        setAdminToken(token); // Save admin token to localStorage
        navigate('/admin/dashboard'); // Redirect to dashboard
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message); // Log error details
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fs-container">
      <div
        className="popup-card scrollable-container"
        style={{ maxWidth: '500px', boxShadow: 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="popup-heading">Admin Login</h1>
        <form onSubmit={handleSubmit} className="popup-form">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input-text"
            required
          />

          <label className="label" htmlFor="password">
            Password
          </label>
          <div className="password-container">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="input-text"
              required
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="eye-icon"
              aria-label="Toggle password visibility"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <div className="label--error">{error}</div>}

          <button
            type="submit"
            className="secondary-button"
            style={{
              marginTop: '24px',
              width: '100%',
              padding: '13px 10px',
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
