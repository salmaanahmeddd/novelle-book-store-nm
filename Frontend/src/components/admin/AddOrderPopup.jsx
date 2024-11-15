import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin/AddOrderPopup.css';

const AddOrderPopup = ({ onClose, onOrderAdded }) => {
  const [books, setBooks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(false); // Track if customer is selected
  const [formData, setFormData] = useState({
    bookId: '',
    userId: '',
    email: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
    price: '',
  });

  const API_KEY = '6515bbff75msh8dda4f61fe3aefdp134589jsn9a0672d6cbb0';
  const API_HOST = 'country-state-city-search-rest-api.p.rapidapi.com';

  // Fetch customers and states on mount
  useEffect(() => {
    const fetchCustomersStates = async () => {
      try {
        // Fetch customers
        const customersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/users/all`);
        setCustomers(customersResponse.data);

        // Fetch states
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
      } catch (error) {
        console.error('Error fetching customers or states:', error);
      }
    };

    fetchCustomersStates();
  }, []);

  // Fetch books when customer is selected
  useEffect(() => {
    if (customerSelected) {
      const fetchBooks = async () => {
        try {
          const booksResponse = await axios.get(`${import.meta.env.VITE_API_URL}/books`);
          setBooks(booksResponse.data);
        } catch (error) {
          console.error('Error fetching books:', error);
        }
      };

      fetchBooks();
    }
  }, [customerSelected]);

  // Fetch cities when state changes
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (e) => {
    const selectedCustomer = customers.find((customer) => customer._id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      userId: selectedCustomer._id,
      email: selectedCustomer.email,
    }));
    setCustomerSelected(true);
  };

  const handleBookChange = (e) => {
    const selectedBook = books.find((book) => book._id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      bookId: selectedBook._id,
      price: selectedBook.price,
    }));
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setFormData((prev) => ({ ...prev, state: stateCode, city: '' }));
    fetchCities(stateCode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const { userId, bookId, address, state, city, pincode } = formData;
    if (!userId || !bookId || !address || !state || !city || !pincode) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/orders/place`, formData);
      alert('Order placed successfully');
      onOrderAdded(response.data);
      onClose();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="add-order-popup__overlay" onClick={onClose}>
      <div className="add-order-popup__card" onClick={(e) => e.stopPropagation()}>
        <h1 className="add-order-popup__heading">Add a New Order</h1>
        <form onSubmit={handleSubmit} className="add-order-popup__form">
          <label className="add-order-popup__label">Customer</label>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleCustomerChange}
            className="add-order-popup__select"
            required
          >
            <option value="">Select a Customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>

          {customerSelected && (
            <>
              <label className="add-order-popup__label">Book</label>
              <select
                name="bookId"
                value={formData.bookId}
                onChange={handleBookChange}
                className="add-order-popup__select"
                required
              >
                <option value="">Select a Book</option>
                {books.map((book) => (
                  <option key={book._id} value={book._id}>
                    {book.title}
                  </option>
                ))}
              </select>

              <label className="add-order-popup__label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="add-order-popup__input"
              />

              <label className="add-order-popup__label">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleStateChange}
                className="add-order-popup__select"
                required
              >
                <option value="">Select a State</option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>

              <label className="add-order-popup__label">City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="add-order-popup__select"
                required
              >
                <option value="">Select a City</option>
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>

              <label className="add-order-popup__label">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="add-order-popup__input"
                placeholder="Enter address"
                required
              />

              <label className="add-order-popup__label">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="add-order-popup__input"
                placeholder="Enter pincode"
                required
              />

              <label className="add-order-popup__label">Price</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                readOnly
                className="add-order-popup__input"
              />
            </>
          )}
          <div className="add-order-popup__button-group">
            <button type="submit" className="add-order-popup__button add-order-popup__button--submit">
              Add Order
            </button>
            <button
              type="button"
              className="add-order-popup__button add-order-popup__button--cancel"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderPopup;
