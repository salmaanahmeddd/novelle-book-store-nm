import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin/Books.css';

const Books = () => {
  const [books, setBooks] = useState([]);

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

  // Calculate metrics
  const totalBooks = books.length;
  const booksThisMonth = books.filter(book => {
    const addedDate = new Date(book.dateAdded);
    const now = new Date();
    return (
      addedDate.getMonth() === now.getMonth() &&
      addedDate.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="books-page">
      <div className="heading">
        <div className="title">
          <h2>Books</h2>
          <p>Manage and view all books in the system.</p>
        </div>
        <button className="add-book-button">Add Book</button>
      </div>

      {/* Metrics Section */}
      <div className="books-metrics-wrapper">
        <div className="books-metric-block">
          <span className="books-metric-label">Total Books</span>
          <span className="books-metric-value">{totalBooks}</span>
        </div>
        <div className="books-metric-block">
          <span className="books-metric-label">Books Added This Month</span>
          <span className="books-metric-value">{booksThisMonth}</span>
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
          <div className="books-seller">Seller</div> {/* New Seller column */}
          <div className="books-action">Action</div>
        </div>

        {books.map((book, index) => (
          <div className="books-table-row" key={book._id}>
            <div className="books-sno">{index + 1}</div>
            <div className="books-title">{book.title}</div>
            <div className="books-author">{book.author}</div>
            <div className="books-genre">{book.genre}</div>
            <div className="books-price">{book.price}</div>
            <div className="books-seller">{book.sellerId?.name || 'N/A'}</div> {/* Display Seller Name */}
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
