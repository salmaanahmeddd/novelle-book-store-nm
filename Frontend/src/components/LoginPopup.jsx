import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { setUserToken, setSellerToken } from '../utils/storage'; // Import role-specific storage
import '../App.css';

const LoginPopup = ({ onClose, onLoginSuccess, onSwapToSignup }) => {
  const [role, setRole] = useState('users');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/${role}/login`, {
        email,
        password,
      });

      const { token, userId } = response.data;

      // Save token based on role
      if (role === 'users') {
        setUserToken(token);
      } else if (role === 'sellers') {
        setSellerToken(token);
      }

      alert('Login successful');
      onLoginSuccess(); // Notify parent
      onClose(); // Close popup
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'An error occurred. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-card scrollable-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '500px',
        }}
      >
        <h1 className="popup-heading">Login to your Account</h1>

        {/* Role Selection Tabs */}
        <div className="tabs">
          <button
            type="button"
            className={`tab ${role === 'users' ? 'active' : ''}`}
            onClick={() => setRole('users')}
          >
            User
          </button>
          <button
            type="button"
            className={`tab ${role === 'sellers' ? 'active' : ''}`}
            onClick={() => setRole('sellers')}
          >
            Seller
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="popup-form">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="input-text"
              required
            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="secondary-button"
            style={{
              marginTop: '24px',
              width: '100%',
              padding: '13px 10px',
            }}
          >
            Login
          </button>
        </form>

        {/* Swap to Signup */}
        <p onClick={onSwapToSignup} className="swap-link">
          Don't have an account? <span className="underline">Signup</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPopup;
