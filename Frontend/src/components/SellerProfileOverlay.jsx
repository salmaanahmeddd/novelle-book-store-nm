import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/Overlay.css"; // Fixed import path

const SellerProfileOverlay = ({ onClose, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/sellers/logout`, {}, {
        withCredentials: true,
      });
      localStorage.removeItem('access-token'); // Clear the token
      onLogout(); // Notify parent of logout
      onClose(); // Close overlay
      navigate('/'); // Redirect to seller login
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out. Please try again.'); // Optional seller feedback
    }
  };

  return (
    <div className="overlay" onClick={(e) => e.stopPropagation()}>
      <div
        className="overlay-option"
        onClick={handleLogout}
        style={{ cursor: 'pointer', color: 'red' }}
      >
        Logout (Seller)
      </div>
    </div>
  );
};

export default SellerProfileOverlay;
