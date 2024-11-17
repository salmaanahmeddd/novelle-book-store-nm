import React, { useState } from 'react';
import axios from 'axios';
import '../../App.css';

const AddUserPopup = ({ onClose, onUserAdded, onUserUpdated, user, isViewMode }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    currentPassword: '',
    newPassword: '',
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
      if (user && !isViewMode) {
        // Edit user
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/users/${user._id}`,
          formData
        );
        onUserUpdated(response.data);
        alert('User updated successfully');
      } else if (!user) {
        // Add new user
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, formData);
        alert('User registered successfully');
        onUserAdded(response.data);
      }
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
        <h1 className="popup-heading">
          {isViewMode ? 'View User Details' : user ? 'Edit User' : 'Add User'}
        </h1>
        <form onSubmit={handleSubmit} className="popup-form">
          <label className="label" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter user's name"
            className="input-text"
            disabled={isViewMode}
            required
          />

          <label className="label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter user's email"
            className="input-text"
            disabled={isViewMode}
            required
          />

          {!isViewMode && user && (
            <>
              <label className="label" htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                className="input-text"
              />

              <label className="label" htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="input-text"
              />
            </>
          )}

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {!isViewMode && (
            <div className="buttons-group">
              <button type="button" className="tertiary-button" onClick={onClose}>Cancel</button>
              <button type="submit" className="secondary-button">
                {user ? 'Update User' : 'Add User'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};


export default AddUserPopup;
