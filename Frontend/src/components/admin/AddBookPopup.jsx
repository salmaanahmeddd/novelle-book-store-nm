import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/storage'; // Ensure this is correctly imported
import useAuth from '../../hooks/useAuth'; // Import the useAuth hook
import '../../App.css';

const AddBookPopup = ({ onClose, onBookAdded }) => {
  const { isLoggedIn, loading } = useAuth(); // Use the hook to check if the user is logged in
  const [sellers, setSellers] = useState([]);
  const [formData, setFormData] = useState({
    sellerId: '',
    title: '',
    author: '',
    genre: '',
    price: '',
    image: null,
  });
  const [isSellerSelected, setIsSellerSelected] = useState(false);

  // Fetch sellers for the dropdown
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const token = getToken();
        if (!token) {
          alert("Authorization token is missing. Please log in.");
          return;
        }
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/sellers/all`, {
          headers: {
            "Authorization": `Bearer ${token}`, // Use the token in the request header
          }
        });
        setSellers(response.data);
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    };
    fetchSellers();
  }, []);

  const handleSellerChange = (e) => {
    const selectedSeller = sellers.find(seller => seller._id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      sellerId: selectedSeller._id,
    }));
    setIsSellerSelected(true); // Make other fields visible after selecting a seller
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { sellerId, title, author, genre, price, image } = formData;
  
    if (!sellerId || !title || !author || !genre || !price || !image) {
      alert("Please fill in all fields before submitting.");
      return;
    }
  
    // Create the FormData object
    const formDataToSend = new FormData();
    formDataToSend.append('title', title);
    formDataToSend.append('author', author);
    formDataToSend.append('genre', genre);
    formDataToSend.append('price', price);
    formDataToSend.append('sellerId', sellerId);
    // formDataToSend.append('itemImage', image); // Make sure 'itemImage' is the correct field name for the image
  
    // Log the FormData content to check
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}: ${value}`);
    }
  
    const token = getToken(); // Retrieve the token from localStorage
  
    if (!token) {
      alert("Authorization token is missing. Please log in.");
      return; // Stop further execution if no token
    }
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/books/add`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Use the token in the request header
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      onBookAdded(response.data);
      onClose();
      alert('Book added successfully');
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add the book. Please try again.');
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <div>You are not logged in. Please log in to add a book.</div>;
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <h1 className="popup-heading">Add a New Book</h1>
        <form className="popup-form" onSubmit={handleSubmit}>
          <label className="label">Seller Name</label>
          <select
            name="sellerId"
            value={formData.sellerId}
            onChange={handleSellerChange}
            className="dropdown"
            required
          >
            <option value="">Select a Seller</option>
            {sellers.map((seller) => (
              <option key={seller._id} value={seller._id}>
                {seller.name} ({seller.email})
              </option>
            ))}
          </select>

          {/* Show the rest of the form only when a seller is selected */}
          {isSellerSelected && (
            <>
              <label className="label">Book Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-text"
                placeholder="Enter book title"
                required
              />

              <label className="label">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="input-text"
                placeholder="Enter author name"
                required
              />

                <label className="label">Genre</label>
                <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="dropdown"
                required
                >
                <option value="">Select Genre</option>
                {[
                    'Fiction', 'Non-Fiction', 'Sci-Fi', 'Biography', 'Self-Help', 'Fantasy', 'History',
                    'Romance', 'Thriller', 'Mystery', 'Adventure', 'Action', 'Horror', 'Children', 
                    'Young Adult', 'Art', 'Music', 'Cooking', 'Philosophy', 'Politics', 'Economics', 
                    'Science', 'Psychology', 'Poetry', 'Sports', 'Health', 'Education', 'Travel', 
                    'Technology', 'Business', 'Humor'
                ].map((genre, index) => (
                    <option key={index} value={genre}>{genre}</option>
                ))}
                </select>

              <label className="label">Price</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="input-text"
                placeholder="Enter price"
                required
              />

              <label className="label">Book Image</label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="input-file"
                required
              />
            </>
          )}

          <div className="buttons-group">
            <button type="button" className="tertiary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="secondary-button">
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookPopup;
