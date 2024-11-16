import React, { useState, useEffect } from 'react';
import LoginPopup from './LoginPopup';
import SignupPopup from './SignupPopup';
import AdminProfileOverlay from './AdminProfileOverlay';
import UserProfileOverlay from './UserProfileOverlay';
import SellerProfileOverlay from './SellerProfileOverlay';
import { getToken, clearToken } from '../utils/storage';
import '../styles/Header.css';
import '../App.css';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); // Track the user's role
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        setRole(decodedToken.role || 'user'); // Set role: 'admin', 'user', or 'seller'
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    const token = getToken(); // Get the token after login
    setIsAuthenticated(true);

    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      setRole(decodedToken.role || 'user'); // Set role immediately after login
    } catch (error) {
      console.error('Error decoding token:', error);
    }

    setShowLoginPopup(false);
    setShowSignupPopup(false);
  };

  const handleLogout = () => {
    clearToken(); // Clear token from localStorage
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
      {showSignupPopup && <SignupPopup onClose={() => setShowSignupPopup(false)} />}

      {showProfileOverlay && role === 'admin' && (
        <AdminProfileOverlay onClose={() => setShowProfileOverlay(false)} onLogout={handleLogout} />
      )}
      {showProfileOverlay && role === 'user' && (
        <UserProfileOverlay onClose={() => setShowProfileOverlay(false)} onLogout={handleLogout} />
      )}
      {showProfileOverlay && role === 'seller' && (
        <SellerProfileOverlay onClose={() => setShowProfileOverlay(false)} onLogout={handleLogout} />
      )}
    </header>
  );
};

export default Header;
