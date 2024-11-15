import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddOrderPopup from '../../components/admin/AddOrderPopup';
import '../../styles/admin/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showAddOrderPopup, setShowAddOrderPopup] = useState(false);

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

  // Simple function to generate a 5-character numeric order ID starting with #
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
          className="add-orders-button"
          onClick={() => setShowAddOrderPopup(true)}
        >
          Add Order
        </button>
      </div>

      {/* Add Order Popup */}
      {showAddOrderPopup && (
        <AddOrderPopup
          onClose={() => setShowAddOrderPopup(false)}
          onOrderAdded={(newOrder) => setOrders((prevOrders) => [...prevOrders, newOrder])}
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
              <img src="/menu-action.svg" alt="Action" className="orders-action-icon" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
