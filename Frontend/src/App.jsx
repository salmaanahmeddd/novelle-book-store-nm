import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboardLayout from './layouts/AdminDashboardLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Sellers from './pages/admin/Sellers';
import Books from './pages/admin/Books';
import Orders from './pages/admin/Orders';
import AdminLogin from './components/AdminLogin';
import AdminPrivateRoute from './components/admin/AdminPrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminPrivateRoute />}>
          <Route path="" element={<AdminDashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="sellers" element={<Sellers />} />
            <Route path="books" element={<Books />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
