// AdminDashboardLayout.jsx
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import ProfileOverlay from '../components/AdminProfileOverlay';
import '../../src/styles/admin/AdminDashboard.css';


const AdminDashboardLayout = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  
  const handleProfileClick = () => {
    setShowOverlay((prev) => !prev);
  };

  const handleOutsideClick = () => {
    setShowOverlay(false);
  };

  return (
    <div className="admin-dashboard" onClick={handleOutsideClick}>
      <div className="sidebar">
        <div className="logo">Novelle</div>
        <div className="nav-links">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <img src="/dashboard.svg" alt="Dashboard" className="icon" />
            <span className="text">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <img src="/person.svg" alt="Users" className="icon" />
            <span className="text">Users</span>
          </NavLink>
          <NavLink to="/admin/sellers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <img src="/person.svg" alt="Sellers" className="icon" />
            <span className="text">Sellers</span>
          </NavLink>
          <NavLink to="/admin/books" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <img src="/book.svg" alt="Books" className="icon" />
            <span className="text">Books</span>
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <img src="/box.svg" alt="Orders" className="icon" />
            <span className="text">Orders</span>
          </NavLink>
        </div>
      </div>

      <div className="main-content">
        <div className="topbar">
          <img
            src="/user.svg"
            alt="User"
            className="user-icon"
            onClick={(e) => {
              e.stopPropagation();
              handleProfileClick();
            }}
          />
          {showOverlay && <ProfileOverlay onClose={() => setShowOverlay(false)} />}
        </div>
        <div className="content">
          <Outlet /> {/* This will render the selected component based on the route */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
