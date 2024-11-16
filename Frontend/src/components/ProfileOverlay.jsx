import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/Overlay.css";

const ProfileOverlay = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/logout`, {}, {
        withCredentials: true
      });
      localStorage.removeItem('access-token'); // Clear the token
      onClose(); // Assuming this resets any relevant state or context
      navigate('/'); // Redirect using React Router
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally inform the user that logout failed
    }
  };
  

  return (
    <div className="overlay" onClick={(e) => e.stopPropagation()}>
      <div className="overlay-option" onClick={handleLogout} style={{color:'Black'}}>Logout</div>
    </div>
  );
};

export default ProfileOverlay;
