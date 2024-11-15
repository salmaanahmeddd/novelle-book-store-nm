import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AdminPrivateRoute = () => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Add a loading spinner if needed
  }

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AdminPrivateRoute;
