import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import '../styles/SignupPopup.css';

const SignupPopup = ({ onClose, onSwapToLogin }) => {
  const [role, setRole] = useState('users');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/${role}/register`, {
        name, email, password
      });
      alert(response.data.message);
      onClose();
    } catch (error) {
      alert('Error signing up');
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <h1>Create your Account</h1>
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
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
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
              type={passwordVisible ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit">Signup</button>
        </form>

        <p onClick={onSwapToLogin} className="swap-link">Already have an account? <span className="underline">Login</span></p>
      </div>
    </div>
  );
};

export default SignupPopup;
