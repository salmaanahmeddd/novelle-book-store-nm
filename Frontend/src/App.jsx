// src/App.jsx
import React from 'react';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/:role" element={<div>Login Page</div>} />
        {/* Add other routes for user/seller login */}
      </Routes>
    </Router>
  );
};

export default App;
