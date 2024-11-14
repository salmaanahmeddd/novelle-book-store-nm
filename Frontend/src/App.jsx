import React, { useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
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

  useEffect(() => {
    const storedAuth = sessionStorage.getItem('isLoggedIn');
    if (storedAuth) {
      setIsLoggedIn(true);
    }
  
    axios.get(`${import.meta.env.VITE_API_URL}/admin/check-auth`)
      .then(response => {
        if (response.data.authenticated) {
          setIsLoggedIn(true);
          sessionStorage.setItem('isLoggedIn', 'true');
        } else {
          setIsLoggedIn(false);
          sessionStorage.removeItem('isLoggedIn');
        }
      })
      .catch(error => {
        console.error('Failed to verify auth:', error);
        setIsLoggedIn(false);
        sessionStorage.removeItem('isLoggedIn');
      });
  }, []);  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/admin" element={isLoggedIn ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />} />

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
