import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddOrderPopup from '../../components/admin/AddOrderPopup';
import ActionOverlay from '../../components/ActionOverlay';
import '../../styles/admin/Orders.css';
import '../../App.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showAddOrderPopup, setShowAddOrderPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // Selected order for view/edit
  const [viewMode, setViewMode] = useState(false); // To determine if view mode is active
  const [showActionOverlay, setShowActionOverlay] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 }); // Overlay position

  // Fetch orders data
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Close the overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowActionOverlay(false);
    };

    if (showActionOverlay) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showActionOverlay]);

const handleActionClick = (event, order) => {
  event.stopPropagation(); // Prevent triggering document click

  if (selectedOrder?._id === order._id && showActionOverlay) {
    // If the same action button is clicked again, close the overlay
    setShowActionOverlay(false);
    setSelectedOrder(null);
    return;
  }

  // Get the bounding box of the action icon
  const rect = event.currentTarget.getBoundingClientRect();

  // Calculate the initial position
  let top = rect.bottom + window.scrollY;
  let left = rect.left + window.scrollX;

  // Adjust for viewport boundaries
  const overlayWidth = 150;
  const overlayHeight = 100;

  if (left + overlayWidth > window.innerWidth) {
    left = window.innerWidth - overlayWidth - 10;
  }

  if (top + overlayHeight > window.innerHeight) {
    top = rect.top + window.scrollY - overlayHeight - 10;
  }

  setOverlayPosition({ top, left });
  setSelectedOrder(order);
  setShowActionOverlay(true);
};

  

  const handleView = () => {
    setViewMode(true);
    setShowAddOrderPopup(true);
    setShowActionOverlay(false);
  };

  const handleEdit = () => {
    setViewMode(false);
    setShowAddOrderPopup(true);
    setShowActionOverlay(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (confirmDelete) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/orders/${selectedOrder._id}`);
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== selectedOrder._id));
        alert("Order deleted successfully.");
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete the order.");
      }
    }
    setShowActionOverlay(false);
  };

  const generateOrderID = (orderId) => {
    const numericOrderId = parseInt(orderId.substring(0, 5), 16);
    return `#${numericOrderId}`;
  };

  return (
    <div className="orders-page">
      <div className="heading">
        <div className="title">
          <h2>Orders</h2>
          <p>Manage and view all orders placed by users.</p>
        </div>
        <button
          className="primary-button"
          onClick={() => {
            setSelectedOrder(null);
            setViewMode(false);
            setShowAddOrderPopup(true);
          }}
        >
          Add Order
        </button>
      </div>

      {/* Add/Edit/View Order Popup */}
      {showAddOrderPopup && (
        <AddOrderPopup
          onClose={() => setShowAddOrderPopup(false)}
          onOrderAdded={(newOrder) => setOrders((prevOrders) => [...prevOrders, newOrder])}
          orderData={selectedOrder}
          viewMode={viewMode}
        />
      )}

      {/* Orders Table */}
      <div className="orders-table">
        <div className="orders-table-header">
          <div className="orders-order-id">Order ID</div>
          <div className="orders-book-title">Book Title</div>
          <div className="orders-book-author">Book Author</div>
          <div className="orders-book-genre">Book Genre</div>
          <div className="orders-user-name">User Name</div>
          <div className="orders-email">Email</div>
          <div className="orders-seller-name">Seller Name</div>
          <div className="orders-order-date">Order Date</div>
          <div className="orders-delivery-date">Delivery Date</div>
          <div className="orders-action">Action</div>
        </div>

        {orders.map((order) => (
          <div className="orders-table-row" key={order._id}>
            <div className="orders-order-id">{generateOrderID(order._id)}</div>
            <div className="orders-book-title">{order.bookDetails?.title || 'N/A'}</div>
            <div className="orders-book-author">{order.bookDetails?.author || 'N/A'}</div>
            <div className="orders-book-genre">{order.bookDetails?.genre || 'N/A'}</div>
            <div className="orders-user-name">{order.userDetails?.name || 'N/A'}</div>
            <div className="orders-email">{order.userDetails?.email || 'N/A'}</div>
            <div className="orders-seller-name">{order.sellerDetails?.name || 'N/A'}</div>
            <div className="orders-order-date">
              {order.bookingDate ? new Date(order.bookingDate).toLocaleDateString() : 'N/A'}
            </div>
            <div className="orders-delivery-date">
              {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}
            </div>
            <div className="orders-action">
              <img
                src="/menu-action.svg"
                alt="Action"
                className="orders-action-icon"
                onClick={(event) => handleActionClick(event, order)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Action Overlay */}
      {showActionOverlay && (
        <div
          style={{
            position: 'absolute',
            top: overlayPosition.top,
            left: overlayPosition.left,
            zIndex: 1000,
          }}
        >
          <ActionOverlay
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClose={() => setShowActionOverlay(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Orders;
