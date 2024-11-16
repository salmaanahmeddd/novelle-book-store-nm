import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddSellerPopup from '../../components/admin/AddSellerPopup';
import '../../styles/admin/Sellers.css';

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [showAddSellerPopup, setShowAddSellerPopup] = useState(false);

  const fetchSellers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/sellers/all`);
      setSellers(response.data);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  return (
    <div className="sellers-page">
      <div className="heading">
        <div className="title">
          <h2>Sellers</h2>
          <p>Manage and view all registered sellers.</p>
        </div>
        <button
          className="primary-button"
          onClick={() => setShowAddSellerPopup(true)}
        >
          Add Seller
        </button>
      </div>

      {showAddSellerPopup && (
        <AddSellerPopup
          onClose={() => setShowAddSellerPopup(false)}
          onSellerAdded={(newSeller) => {
            setSellers((prevSellers) => [...prevSellers, newSeller]);
          }}
        />
      )}

      <div className="sellers-metrics-wrapper">
        <div className="sellers-metric-block">
          <span className="sellers-metric-label">Total Sellers</span>
          <span className="sellers-metric-value">{sellers.length}</span>
        </div>
      </div>

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
