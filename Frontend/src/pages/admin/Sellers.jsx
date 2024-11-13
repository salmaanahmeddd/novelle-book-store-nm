import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin/Sellers.css';

const Sellers = () => {
  const [sellers, setSellers] = useState([]);

  // Fetch sellers data
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/sellers/all`);
        setSellers(response.data);
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    };
    fetchSellers();
  }, []);

  // Calculate metrics
  const totalSellers = sellers.length;

  return (
    <div className="sellers-page">
      <div className="heading">
        <div className="title">
          <h2>Sellers</h2>
          <p>Manage and view all registered sellers.</p>
        </div>
        <button className="add-sellers-button">Add Seller</button>
      </div>

      {/* Metrics Section */}
      <div className="sellers-metrics-wrapper">
        <div className="sellers-metric-block">
          <span className="sellers-metric-label">Total Sellers</span>
          <span className="sellers-metric-value">{totalSellers}</span>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="sellers-table">
        <div className="sellers-table-header">
          <div className="sellers-sno">S.No</div>
          <div className="sellers-name">Name</div>
          <div className="sellers-email">Email</div>
          <div className="sellers-action">Action</div>
        </div>

        {sellers.map((seller, index) => (
          <div className="sellers-table-row" key={seller._id}>
            <div className="sellers-sno">{index + 1}</div>
            <div className="sellers-name">{seller.name}</div>
            <div className="sellers-email">{seller.email}</div>
            <div className="sellers-action">
              <img src="/menu-action.svg" alt="Action" className="sellers-action-icon" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sellers;
