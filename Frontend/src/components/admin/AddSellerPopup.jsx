import React, { useState } from 'react';
import axios from 'axios';
import '../../App.css';

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
        <h1 className="popup-heading">Register a New Seller</h1>
        <form onSubmit={handleSubmit} className="popup-form">
          <label className="label" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter seller's name"
            className="input-text"
            required
          />

          <label className="label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter seller's email"
            className="input-text"
            required
          />

          <label className="label" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            className="input-text"
            required
          />

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="buttons-group">
            <button type="button" className="tertiary-button" onClick={onClose}>Cancel</button>
            <button type="button" className="secondary-button" onClick={handleSubmit}>Add Seller</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSellerPopup;
