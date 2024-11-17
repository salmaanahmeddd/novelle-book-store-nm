import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddUserPopup from '../../components/admin/AddUserPopup';
import ActionOverlay from '../../components/ActionOverlay';
import '../../styles/admin/Users.css';
import '../../App.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState(false); // Track whether popup is in view mode
  const [showActionOverlay, setShowActionOverlay] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 });

  // Fetch users data
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/all`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Calculate metrics
  const totalUsers = users.length;

  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
  };

  const handleDeleteUser = async (userId) => {
    console.log('Deleting user with ID:', userId); // Debugging
  
    const adminToken = localStorage.getItem('admin-access-token'); // Ensure correct token is retrieved
  
    if (!adminToken) {
      alert('Authorization token missing. Please log in as admin.');
      return;
    }
  
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`, // Include token in the request
          },
        }
      );
  
      alert('User deleted successfully');
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Failed to delete user. Please try again.');
    }
  };
  
  

  const handleActionClick = (event, user) => {
    event.stopPropagation();

    if (selectedUser?._id === user._id && showActionOverlay) {
      setShowActionOverlay(false);
      setSelectedUser(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    let top = rect.bottom + window.scrollY;
    let left = rect.left + window.scrollX;

    const overlayWidth = 150;
    const overlayHeight = 100;

    if (left + overlayWidth > window.innerWidth) {
      left = window.innerWidth - overlayWidth - 10;
    }

    if (top + overlayHeight > window.innerHeight) {
      top = rect.top + window.scrollY - overlayHeight - 10;
    }

    setOverlayPosition({ top, left });
    setSelectedUser(user);
    setShowActionOverlay(true);
  };

  const handleView = () => {
    setViewMode(true);
    setShowAddUserPopup(true);
    setShowActionOverlay(false);
  };

  const handleEdit = () => {
    setViewMode(false);
    setShowAddUserPopup(true);
    setShowActionOverlay(false);
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
              <img
                src="/menu-action.svg"
                alt="Action"
                className="users-action-icon"
                onClick={(event) => handleActionClick(event, user)}
              />
            </div>
          </div>
        ))}
      </div>

      {showActionOverlay && (
        <div
          style={{
            position: 'absolute',
            top: `${overlayPosition.top}px`,
            left: `${overlayPosition.left}px`,
            zIndex: 1000,
          }}
        >
          <ActionOverlay
            onView={handleView}
            onEdit={handleEdit}
            onDelete={() => handleDeleteUser(selectedUser._id)}
            onClose={() => setShowActionOverlay(false)}
          />
        </div>
      )}

      {showAddUserPopup && (
        <AddUserPopup
          onClose={() => setShowAddUserPopup(false)}
          onUserAdded={handleAddUser}
          onUserUpdated={handleUpdateUser}
          user={viewMode ? selectedUser : null} // Pass selected user for view or edit
          isViewMode={viewMode}
        />
      )}
    </div>
  );
};

export default Users;
