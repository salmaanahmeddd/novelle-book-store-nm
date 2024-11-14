import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboardLayout from './layouts/AdminDashboardLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Sellers from './pages/admin/Sellers';
import Books from './pages/admin/Books';
import Orders from './pages/admin/Orders';
// Import AdminLogin if needed for the future login flow
// import AdminLogin from './components/AdminLogin';

const App = () => {
  // Set isLoggedIn to true by default to skip login check
  const isLoggedIn = true;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Admin Layout without authentication check */}
        <Route
          path="/admin"
          element={<AdminDashboardLayout />}
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
