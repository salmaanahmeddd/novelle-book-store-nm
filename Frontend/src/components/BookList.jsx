import React, { useState, useEffect } from 'react';
import '../styles/BookList.css'


const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  // Fetching the books from your backend API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/books`);
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="books-list">
      {error && <p>Error: {error}</p>}
      {books.length > 0 ? (
        books.map((book) => (
          <div key={book._id} className="book-item">
            <img
              src={book.itemImage}
              alt={book.title}
              className="book-image"
            />
            <div className="book-details">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <p>{book.genre}</p>
              <p className='price' style={{fontWeight:'800', fontSize:'16px', color:'#30343F'}}>{book.price}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No books available</p>
      )}
    </div>
  );
};

export default BooksList;
