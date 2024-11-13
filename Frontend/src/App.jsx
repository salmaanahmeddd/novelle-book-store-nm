import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboardLayout from './layouts/AdminDashboardLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Sellers from './pages/admin/Sellers';
import Books from './pages/admin/Books';
import Orders from './pages/admin/Orders';
import AdminLogin from './components/AdminLogin';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check token presence on component load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true); // Token is present, user is logged in
    } else {
      setIsLoggedIn(false); // No token, user is not logged in
    }
  }, []); // Empty dependency array to run only once on mount

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/:role" element={<AdminLogin />} />

        {/* Admin Layout with authentication check */}
        <Route
          path="/admin"
          element={isLoggedIn ? <AdminDashboardLayout /> : <Navigate to="/login/admin" replace />}
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="sellers" element={<Sellers />} />
          <Route path="books" element={<Books />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
