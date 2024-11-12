// src/components/Header.jsx
import React, { useState } from 'react';
import LoginPopup from './LoginPopup';
import SignupPopup from './SignupPopup'; // Assuming your SignupPopup component is here
import '../styles/Header.css';

const Header = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  const handleLoginClick = () => {
    setShowLoginPopup(true);
    setShowSignupPopup(false);
  };

  const handleSignupClick = () => {
    setShowSignupPopup(true);
    setShowLoginPopup(false);
  };

  const handleClosePopup = () => {
    setShowLoginPopup(false);
    setShowSignupPopup(false);
  };

  const handleLoginSuccess = () => {
    alert('Login successful');
  };

  const handleSwapToSignup = () => {
    setShowSignupPopup(true);
    setShowLoginPopup(false);
  };

  const handleSwapToLogin = () => {
    setShowLoginPopup(true);
    setShowSignupPopup(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <span className="logo">Novelle</span>
      </div>
      <div className="header-right">
        <button className="login-button" onClick={handleLoginClick}>Login</button>
        <button className="signup-button" onClick={handleSignupClick}>Signup</button>
      </div>

      {showLoginPopup && <LoginPopup onClose={handleClosePopup} onLoginSuccess={handleLoginSuccess} onSwapToSignup={handleSwapToSignup} />}
      {showSignupPopup && <SignupPopup onClose={handleClosePopup} onSwapToLogin={handleSwapToLogin} />}
    </header>
  );
};

export default Header;
