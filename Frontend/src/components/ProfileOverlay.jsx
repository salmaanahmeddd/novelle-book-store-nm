// components/ProfileOverlay.jsx
import React from 'react';
import "../styles/ProfileOverlay.css";

const ProfileOverlay = ({ onClose }) => {
  return (
    <div className="profile-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="overlay-option" onClick={onClose}>Logout</div>
    </div>
  );
};

export default ProfileOverlay;
