import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { clearAdminToken } from '../utils/storage';
import '../styles/Overlay.css';

const AdminProfileOverlay = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/logout`, {}, {
        withCredentials: true,
      });
      clearAdminToken(); // Clear the admin token
      onClose(); // Close the overlay
      navigate('/admin/login'); // Redirect to the admin login page
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
        Logout (Admin)
      </div>
    </div>
  );
};

export default AdminProfileOverlay;
