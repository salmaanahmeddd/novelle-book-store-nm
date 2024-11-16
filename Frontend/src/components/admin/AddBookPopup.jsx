import React, { useState } from 'react';
import axios from 'axios';
import '../../App.css';

const AddBookPopup = ({ onClose, onBookAdded }) => {
    const [bookDetails, setBookDetails] = useState({
        title: '',
        author: '',
        genre: '',
        description: '',
        price: '',
        itemImage: null, // State to hold the image file
    });

    const genres = [
        { id: 'fiction', name: 'Fiction' },
        { id: 'nonfiction', name: 'Non-fiction' },
        { id: 'mystery', name: 'Mystery' },
        { id: 'sci-fi', name: 'Sci-Fi' },
        { id: 'fantasy', name: 'Fantasy' },
        { id: 'romance', name: 'Romance' },
        { id: 'thriller', name: 'Thriller' },
        { id: 'others', name: 'Others' },
    ];

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'itemImage') {
            setBookDetails({ ...bookDetails, [name]: files[0] });
        } else {
            setBookDetails({ ...bookDetails, [name]: value });
        }
    };

    const submitBook = async () => {
        try {
            const formData = new FormData();
            formData.append('title', bookDetails.title);
            formData.append('author', bookDetails.author);
            formData.append('genre', bookDetails.genre);
            formData.append('description', bookDetails.description);
            formData.append('price', bookDetails.price);
            if (bookDetails.itemImage) {
                formData.append('itemImage', bookDetails.itemImage);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('access-token')}`,
                },
            };

            const apiURL = import.meta.env.VITE_API_URL || 'http://defaulturl.com';
            const response = await axios.post(`${apiURL}/books/add`, formData, config);
            onBookAdded(response.data);
            onClose();
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-card scrollable-container" onClick={(e) => e.stopPropagation()}>
                <h2 className="popup-heading">Add New Book</h2>
                <form>
                    <label htmlFor="title" className="label">Title</label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Title"
                        name="title"
                        onChange={handleInputChange}
                        className="input-text"
                    />

                    <label htmlFor="author" className="label">Author</label>
                    <input
                        type="text"
                        id="author"
                        placeholder="Author"
                        name="author"
                        onChange={handleInputChange}
                        className="input-text"
                    />

                    <label htmlFor="genre" className="label">Genre</label>
                    <select
                        id="genre"
                        name="genre"
                        value={bookDetails.genre}
                        onChange={handleInputChange}
                        className="dropdown"
                    >
                        <option value="">Select Genre</option>
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.id}>
                                {genre.name}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="description" className="label">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        onChange={handleInputChange}
                        className="textarea"
                    ></textarea>

                    <label htmlFor="price" className="label">Price</label>
                    <input
                        type="text"
                        id="price"
                        placeholder="Price"
                        name="price"
                        onChange={handleInputChange}
                        className="input-text"
                    />

                    <label htmlFor="itemImage" className="label">Upload Image</label>
                    <input
                        type="file"
                        id="itemImage"
                        name="itemImage"
                        onChange={handleInputChange}
                        className="file-input"
                    />

                    <div className="buttons-group">
                        <button type="button" className="tertiary-button" onClick={onClose}>Cancel</button>
                        <button type="button" className="secondary-button" onClick={submitBook}>Add Book</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBookPopup;
