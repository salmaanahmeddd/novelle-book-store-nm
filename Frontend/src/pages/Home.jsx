// src/pages/Home.jsx
import React, { useState } from 'react';
import Header from '../components/Header';
import SignupPopup from '../components/SignupPopup';
import BookList from '../components/BookList'; // Import BookList component
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
      <BookList /> {/* Display BookList on Home page */}
    </div>
  );
};

export default Home;
