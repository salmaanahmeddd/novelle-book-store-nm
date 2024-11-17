import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { clearUserToken, clearSellerToken } from '../utils/storage';
import "../styles/Overlay.css";

const UserProfileOverlay = ({ onClose, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Determine which role is logged in
      const userTokenExists = !!localStorage.getItem('user-access-token');
      const sellerTokenExists = !!localStorage.getItem('seller-access-token');

      if (userTokenExists) {
        // Log out as user
        await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`, {}, {
          withCredentials: true,
        });
        clearUserToken();
      }

      if (sellerTokenExists) {
        // Log out as seller
        await axios.post(`${import.meta.env.VITE_API_URL}/sellers/logout`, {}, {
          withCredentials: true,
        });
        clearSellerToken();
      }

      onLogout(); // Notify parent component
      onClose(); // Close the overlay
      navigate('/'); // Redirect to home
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="overlay" onClick={(e) => e.stopPropagation()}>
      <div
        className="overlay-option"
        onClick={handleLogout}
        style={{ cursor: 'pointer', color: 'red' }}
      >
        Logout
      </div>
    </div>
  );
};

export default UserProfileOverlay;
