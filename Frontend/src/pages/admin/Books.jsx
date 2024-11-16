import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddBookPopup from '../../components/admin/AddBookPopup'; // Make sure the path matches your file structure
import '../../styles/admin/Books.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [showAddBookPopup, setShowAddBookPopup] = useState(false);

  // Fetch books data
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/books`);
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  // Function to add a book to the local state
  const handleAddBook = (newBook) => {
    setBooks(prevBooks => [newBook, ...prevBooks]);
    setShowAddBookPopup(false); // Close the popup after book is added
  };

  return (
    <div className="books-page">
      <div className="heading">
        <div className="title">
          <h2>Books</h2>
          <p>Manage and view all books in the system.</p>
        </div>
        <button className="primary-button" onClick={() => setShowAddBookPopup(true)}>Add Book</button>
      </div>

      {/* Add Book Popup */}
      {showAddBookPopup && (
        <AddBookPopup
          onClose={() => setShowAddBookPopup(false)}
          onBookAdded={handleAddBook}
        />
      )}

      {/* Metrics Section */}
      <div className="books-metrics-wrapper">
        <div className="books-metric-block">
          <span className="books-metric-label">Total Books</span>
          <span className="books-metric-value">{books.length}</span>
        </div>
        <div className="books-metric-block">
          <span className="books-metric-label">Books Added This Month</span>
          <span className="books-metric-value">{books.filter(book => {
            const addedDate = new Date(book.dateAdded);
            const now = new Date();
            return (
              addedDate.getMonth() === now.getMonth() &&
              addedDate.getFullYear() === now.getFullYear()
            );
          }).length}</span>
        </div>
      </div>

      {/* Books Table */}
      <div className="books-table">
        <div className="books-table-header">
          <div className="books-sno">S.No</div>
          <div className="books-title">Title</div>
          <div className="books-author">Author</div>
          <div className="books-genre">Genre</div>
          <div className="books-price">Price</div>
          <div className="books-seller">Seller</div>
          <div className="books-action">Action</div>
        </div>

        {books.map((book, index) => (
          <div className="books-table-row" key={book._id}>
            <div className="books-sno">{index + 1}</div>
            <div className="books-title">{book.title}</div>
            <div className="books-author">{book.author}</div>
            <div className="books-genre">{book.genre}</div>
            <div className="books-price">{book.price}</div>
            <div className="books-seller">{book.sellerId?.name || 'N/A'}</div>
            <div className="books-action">
              <img src="/menu-action.svg" alt="Action" className="books-action-icon" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
