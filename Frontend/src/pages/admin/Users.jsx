import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddUserPopup from '../../components/admin/AddUserPopup'; 
import '../../styles/admin/Users.css'// Import the popup component
import '../../App.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/all`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Calculate metrics
  const totalUsers = users.length;

  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  return (
    <div className="users-page">
      <div className="heading">
        <div className="title">
          <h2>Users</h2>
          <p>This page allows you to manage and view all users in the system.</p>
        </div>
        <button className="primary-button" onClick={() => setShowAddUserPopup(true)}>
          Add User
        </button>
      </div>

      {/* Metrics Section */}
      <div className="users-metrics-wrapper">
        <div className="users-metric-block">
          <span className="users-metric-label">Total Users</span>
          <span className="users-metric-value">{totalUsers}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table">
        <div className="users-table-header">
          <div className="users-sno">S.No</div>
          <div className="users-name">Name</div>
          <div className="users-email">Email</div>
          <div className="users-action">Action</div>
        </div>

        {users.map((user, index) => (
          <div className="users-table-row" key={user._id}>
            <div className="users-sno">{index + 1}</div>
            <div className="users-name">{user.name}</div>
            <div className="users-email">{user.email}</div>
            <div className="users-action">
              <img src="/menu-action.svg" alt="Action" className="users-action-icon" />
            </div>
          </div>
        ))}
      </div>

      {showAddUserPopup && (
        <AddUserPopup onClose={() => setShowAddUserPopup(false)} onUserAdded={handleAddUser} />
      )}
    </div>
  );
};

export default Users;
