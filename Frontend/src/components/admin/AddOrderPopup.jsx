import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../App.css';

const AddOrderPopup = ({ onClose, onOrderAdded, orderData = null, viewMode = false }) => {
  const [books, setBooks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(false);

  const [formData, setFormData] = useState({
    bookId: orderData?.bookId || '',
    userId: orderData?.userId || '',
    email: orderData?.userDetails?.email || '',
    address: orderData?.address || '',
    state: orderData?.state || '',
    city: orderData?.city || '',
    pincode: orderData?.pincode || '',
    price: orderData?.bookDetails?.price || '',
  });

  const API_KEY = '6515bbff75msh8dda4f61fe3aefdp134589jsn9a0672d6cbb0';
  const API_HOST = 'country-state-city-search-rest-api.p.rapidapi.com';

  useEffect(() => {
    const fetchCustomersAndStates = async () => {
      try {
        const customersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/users/all`);
        setCustomers(customersResponse.data);

        const statesResponse = await axios.request({
          method: 'GET',
          url: 'https://country-state-city-search-rest-api.p.rapidapi.com/states-by-countrycode',
          params: { countrycode: 'IN' },
          headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': API_HOST,
          },
        });
        setStates(statesResponse.data);

        if (orderData?.state) {
          fetchCities(orderData.state);
        }
      } catch (error) {
        console.error('Error fetching customers or states:', error);
      }
    };

    fetchCustomersAndStates();
  }, [orderData?.state]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksResponse = await axios.get(`${import.meta.env.VITE_API_URL}/books`);
        setBooks(booksResponse.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    if (customerSelected || orderData) {
      fetchBooks();
    }
  }, [customerSelected, orderData]);

  const fetchCities = async (stateCode) => {
    try {
      const citiesResponse = await axios.request({
        method: 'GET',
        url: 'https://country-state-city-search-rest-api.p.rapidapi.com/cities-by-countrycode-and-statecode',
        params: { countrycode: 'IN', statecode: stateCode },
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
        },
      });
      setCities(citiesResponse.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleChange = (e) => {
    if (viewMode) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (e) => {
    if (viewMode) return;
    const selectedCustomer = customers.find((customer) => customer._id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      userId: selectedCustomer._id,
      email: selectedCustomer.email,
    }));
    setCustomerSelected(true);
  };

  const handleBookChange = (e) => {
    if (viewMode) return;
    const selectedBook = books.find((book) => book._id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      bookId: selectedBook._id,
      price: selectedBook.price,
    }));
  };

  const handleStateChange = (e) => {
    if (viewMode) return;
    const stateCode = e.target.value;
    setFormData((prev) => ({ ...prev, state: stateCode, city: '' }));
    fetchCities(stateCode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (viewMode) return;

    const { userId, bookId, address, state, city, pincode } = formData;
    if (!userId || !bookId || !address || !state || !city || pincode.trim() === '') {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      if (orderData) {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderData._id}`, formData);
        alert('Order updated successfully');
        onOrderAdded(response.data);
      } else {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/orders/place`, formData);
        alert('Order placed successfully');
        onOrderAdded(response.data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save order. Please try again.');
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card scrollable-container" onClick={(e) => e.stopPropagation()}>
        <h1 className="popup-heading">
          {orderData ? (viewMode ? 'View Order' : 'Edit Order') : 'Add a New Order'}
        </h1>
        <form className="popup-form">
          <label className="label">Customer</label>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleCustomerChange}
            className="dropdown"
            required
            disabled={viewMode}
          >
            <option value="">Select a Customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>

          {(customerSelected || orderData) && (
            <>
              <label className="label">Book</label>
              <select
                name="bookId"
                value={formData.bookId}
                onChange={handleBookChange}
                className="dropdown"
                required
                disabled={viewMode}
              >
                <option value="">Select a Book</option>
                {books.map((book) => (
                  <option key={book._id} value={book._id}>
                    {book.title}
                  </option>
                ))}
              </select>

              <label className="label">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleStateChange}
                className="dropdown"
                required
                disabled={viewMode}
              >
                <option value="">Select a State</option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>

              <label className="label">City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="dropdown"
                required
                disabled={viewMode}
              >
                <option value="">Select a City</option>
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>

              <label className="label">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input-text"
                placeholder="Enter address"
                required
                readOnly={viewMode}
              />

              <label className="label">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="input-text"
                placeholder="Enter pincode"
                required
                readOnly={viewMode}
              />

              <label className="label">Price</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                readOnly
                className="input-text"
              />
            </>
          )}
          <div className="buttons-group">
            {!viewMode && (
              <button type="button" className="tertiary-button" onClick={onClose}>
                Cancel
              </button>
            )}
            {!viewMode && (
              <button type="submit" className="secondary-button" onClick={handleSubmit}>
                {orderData ? 'Update Order' : 'Add Order'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderPopup;
