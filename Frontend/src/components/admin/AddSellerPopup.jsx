import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/admin/AddSellerPopup.css';

const AddSellerPopup = ({ onClose, onSellerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/sellers/register`,
        formData
      );

      alert('Seller registered successfully');
      onSellerAdded(response.data);
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'An error occurred. Please try again.';
      setErrorMessage(errorMessage);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <h1>Register a New Seller</h1>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter seller's name"
            required
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter seller's email"
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit">Register Seller</button>
        </form>
      </div>
    </div>
  );
};

export default AddSellerPopup;
