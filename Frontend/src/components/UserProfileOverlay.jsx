import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/Overlay.css"; // Fixed import path

const UserProfileOverlay = ({ onClose, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`, {}, {
        withCredentials: true,
      });
      localStorage.removeItem('access-token'); // Clear the token
      onLogout(); // Notify parent of logout
      onClose(); // Close overlay
      navigate('/'); // Redirect to the home page
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out. Please try again.'); // Optional user feedback
    }
  };

  return (
    <div className="overlay" onClick={(e) => e.stopPropagation()}>
      <div
        className="overlay-option"
        onClick={handleLogout}
        style={{ cursor: 'pointer', color: 'red' }}
      >
        Logout (User)
      </div>
    </div>
  );
};

export default UserProfileOverlay;
