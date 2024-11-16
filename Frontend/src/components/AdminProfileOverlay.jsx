import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "..//styles/Overlay.css";

const AdminProfileOverlay = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/logout`, {}, {
        withCredentials: true,
      });
      localStorage.removeItem('access-token'); // Clear the token
      onClose(); // Close overlay
      navigate('/admin/login'); // Redirect to admin login
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally inform the user about logout failure
    }
  };

  return (
    <div className="overlay" onClick={(e) => e.stopPropagation()}>
      <div className="overlay-option" onClick={handleLogout} style={{ cursor: 'pointer', color: 'red' }}>
        Logout (Admin)
      </div>
    </div>
  );
};

export default AdminProfileOverlay;
