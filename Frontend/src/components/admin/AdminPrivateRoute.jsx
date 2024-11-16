import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AdminPrivateRoute = () => {
  const { isLoggedIn, loading } = useAuth('admin'); // Ensure role is explicitly set to admin
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Optional: Add a spinner or loading component
  }

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AdminPrivateRoute;
