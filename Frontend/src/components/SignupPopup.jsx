import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setUserToken, setSellerToken } from '../utils/storage';
import '../App.css';

const SignupPopup = ({ onClose, onSwapToLogin, onSignupSuccess }) => {
  const [role, setRole] = useState('users'); // Default role is 'users'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/${role}/register`,
        { name, email, password }
      );

      console.log('Response from server:', response);

      const { token, message } = response.data;
      if (!token) {
        throw new Error('Token is missing from the server response');
      }

      // Save the token dynamically based on the role
      if (role === 'users') {
        setUserToken(token);
      } else if (role === 'sellers') {
        setSellerToken(token);
      }

      alert(message || 'Signup successful');

      // Notify parent about signup success
      if (onSignupSuccess) {
        onSignupSuccess();
      }

      // Redirect the user to the home or dashboard page
      if (role === 'users') {
        navigate('/'); // Replace with actual user dashboard route
      } else if (role === 'sellers') {
        navigate('/'); // Replace with actual seller dashboard route
      }

      onClose(); // Close the popup
    } catch (error) {
      console.error('Error during signup:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.error || 'Error signing up. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-card scrollable-container"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '500px' }}
      >
        <h1 className="popup-heading">Create your Account</h1>

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

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="popup-form">
          <label className="label" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="input-text"
            required
          />

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
              padding: '16px 10px',
            }}
          >
            Signup
          </button>
        </form>

        <p onClick={onSwapToLogin} className="swap-link">
          Already have an account? <span className="underline">Login</span>
        </p>
      </div>
    </div>
  );
};

export default SignupPopup;
