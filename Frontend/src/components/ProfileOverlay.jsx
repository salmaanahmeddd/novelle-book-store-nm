import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/ProfileOverlay.css";

const ProfileOverlay = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Optionally send a logout request to the backend
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/logout`, {}, {
        withCredentials: true
      });

      // Clear any authentication/session storage or cookies here
      sessionStorage.removeItem('isLoggedIn'); // If you are using session storage to manage logged in state
      // Clear cookies if they are used (This might need to be done server-side depending on security configuration)

      // Update any global state if using context or Redux (not shown here, but assumed to be managed outside this component)
      onClose();  // This might include state resetting

      // Redirect to login page or home page
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle any errors, such as showing a message to the user
    }
  };

  return (
    <div className="profile-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="overlay-option" onClick={handleLogout}>Logout</div>
    </div>
  );
};

export default ProfileOverlay;
