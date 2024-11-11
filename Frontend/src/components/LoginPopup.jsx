// src/components/LoginPopup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons from react-icons
import '../styles/SignupPopup.css'; // You can reuse the same styles

const LoginPopup = ({ onClose, onLoginSuccess }) => {
  const [role, setRole] = useState('users'); // Default to user role
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/${role}/login`, {
        email, password
      });

      // On successful login, store the token and user ID
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);

      alert('Login successful');
      onLoginSuccess(); // Notify parent of successful login
      onClose(); // Close the popup
    } catch (error) {
      // Show specific error message based on the response from the server
      const errorMessage = error.response?.data?.error || 'An error occurred. Please try again.';
      alert(errorMessage); // Show the error message
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <h1>Login to your Account</h1>
        <div className="tabs">
          <button
            className={`tab ${role === 'users' ? 'active' : ''}`}
            onClick={() => setRole('users')}
          >
            User
          </button>
          <button
            className={`tab ${role === 'sellers' ? 'active' : ''}`}
            onClick={() => setRole('sellers')}
          >
            Seller
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <label>Password</label>
          <div className="password-container">
            <input
              type={passwordVisible ? "text" : "password"} // Toggle password visibility
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* Toggle between eye and eye-slash */}
            </button>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;
