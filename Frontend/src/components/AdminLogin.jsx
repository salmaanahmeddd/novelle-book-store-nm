import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import the eye icons
import '../styles/admin/AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);  // Ensure values are correct
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/login`, {
        email,
        password,
      });
  
      console.log(response.data); // Log the response to inspect it
  
      if (response.data.token) {
        // Save token and adminId to sessionStorage
        sessionStorage.setItem('authToken', response.data.token); 
        sessionStorage.setItem('adminId', response.data.adminId); // Save adminId
        console.log("Token and AdminId saved to sessionStorage:", response.data.token, response.data.adminId);
        
        // Navigate to the dashboard after successful login
        navigate('/admin/dashboard'); 
      } else {
        setError('Login failed: No token received.');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error);  // Log detailed error message
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-form">
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <label className="admin-login-label">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            className="admin-login-input"
            placeholder="Enter your email"
          />
          <label className="admin-login-label">Password</label>
          <div className="admin-login-password-container">
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={handleChange}
              className="admin-login-input"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="admin-eye-icon"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* Use the eye icons */}
            </button>
          </div>
          {error && <div className="admin-error-message">{error}</div>}
          <button type="submit" className="admin-login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
