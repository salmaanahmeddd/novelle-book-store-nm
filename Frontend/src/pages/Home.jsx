// src/pages/Home.jsx
import React, { useState } from 'react';
import Header from '../components/Header';
import SignupPopup from '../components/SignupPopup';
import '../styles/Home.css';

const Home = () => {
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  const handleSignupClick = () => {
    setShowSignupPopup(true);
  };

  const handleClosePopup = () => {
    setShowSignupPopup(false);
  };

  return (
    <div className="home">
      <Header onSignupClick={handleSignupClick} />
      {showSignupPopup && <SignupPopup onClose={handleClosePopup} />}
    </div>
  );
};

export default Home;
