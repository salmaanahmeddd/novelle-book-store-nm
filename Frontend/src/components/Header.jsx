import React, { useState, useEffect } from 'react';
import LoginPopup from './LoginPopup';
import SignupPopup from './SignupPopup';
import UserProfileOverlay from './UserProfileOverlay';
import { getUserToken, getSellerToken, clearUserToken, clearSellerToken } from '../utils/storage';
import '../styles/Header.css';
import '../App.css';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); // Track the user's role
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  useEffect(() => {
    const userToken = getUserToken();
    const sellerToken = getSellerToken();

    if (userToken) {
      setIsAuthenticated(true);
      setRole('user'); // Set role based on token presence
    } else if (sellerToken) {
      setIsAuthenticated(true);
      setRole('seller'); // Set role based on token presence
    }
  }, []);

  const handleLoginSuccess = () => {
    const userToken = getUserToken();
    const sellerToken = getSellerToken();

    setIsAuthenticated(true);
    if (userToken) {
      setRole('user'); // Set role immediately after login
    } else if (sellerToken) {
      setRole('seller'); // Set role immediately after login
    }

    setShowLoginPopup(false);
    setShowSignupPopup(false);
  };

  const handleLogout = () => {
    if (role === 'user') {
      clearUserToken(); // Clear user token
    } else if (role === 'seller') {
      clearSellerToken(); // Clear seller token
    }

    setIsAuthenticated(false); // Reset authenticated state
    setRole(null); // Clear role state
    setShowProfileOverlay(false); // Close profile overlay
  };

  const toggleProfileOverlay = () => {
    setShowProfileOverlay((prev) => !prev);
  };

  return (
    <header className="header">
      <div className="header-left">
        <span className="logo">Novelle</span>
      </div>
      <div className="header-right">
        {!isAuthenticated ? (
          <>
            <button className="login-button" onClick={() => setShowLoginPopup(true)}>Login</button>
            <button className="primary-button" onClick={() => setShowSignupPopup(true)}>Signup</button>
          </>
        ) : (
          <img
            src="/user.svg"
            alt="User"
            className="user-icon"
            onClick={toggleProfileOverlay}
          />
        )}
      </div>

      {showLoginPopup && (
        <LoginPopup
          onClose={() => setShowLoginPopup(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showSignupPopup && (
        <SignupPopup
          onClose={() => setShowSignupPopup(false)}
          onSignupSuccess={handleLoginSuccess} // Reuse login success handler
        />
      )}


      {showProfileOverlay && role === 'user' && (
        <UserProfileOverlay onClose={() => setShowProfileOverlay(false)} onLogout={handleLogout} />
      )}
      {showProfileOverlay && role === 'seller' && (
        <UserProfileOverlay onClose={() => setShowProfileOverlay(false)} onLogout={handleLogout} />
      )}
    </header>
  );
};

export default Header;
