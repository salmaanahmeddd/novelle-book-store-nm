import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getSellerToken } from '../../utils/storage'; // Use seller-specific token
import useAuth from '../../hooks/useAuth'; // Import the useAuth hook
import '../../App.css';

const AddBookPopup = ({ onClose, onBookAdded }) => {
  const { isLoggedIn, loading } = useAuth('seller'); // Check seller's authentication
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    price: '',
    image: null,
  });

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

    const { title, author, genre, price, image } = formData;

    if (!title || !author || !genre || !price || !image) {
      alert('Please fill in all fields before submitting.');
      return;
    }

    // Create the FormData object
    const formDataToSend = new FormData();
    formDataToSend.append('title', title);
    formDataToSend.append('author', author);
    formDataToSend.append('genre', genre);
    formDataToSend.append('price', price);
    formDataToSend.append('image', image); // Ensure this matches your backend's expected field name

    const token = getSellerToken(); // Use seller-specific token
    if (!token) {
      alert('Authorization token is missing. Please log in.');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/books/add`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the header
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      onBookAdded(response.data); // Notify parent about the new book
      onClose(); // Close popup
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
    return <div>You are not logged in as a seller. Please log in to add a book.</div>;
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <h1 className="popup-heading">Add a New Book</h1>
        <form className="popup-form" onSubmit={handleSubmit}>
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
              'Technology', 'Business', 'Humor',
            ].map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
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
