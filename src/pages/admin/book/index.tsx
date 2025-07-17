import React, { useEffect, useState } from 'react';
import { getBooks, searchBooks, filterBooksByAuthor, filterBooksByYear } from '@/utils/api';
import BookDataTable from '@/components/organism/BooksTable/index';

const BookIndex = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterYear, setFilterYear] = useState('');

  // Cargar todos los libros al inicio
  useEffect(() => {
    fetchAllBooks();
  }, []);

  const fetchAllBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // Buscar por título, autor o género
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await searchBooks(searchQuery);
      setBooks(data);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  // Filtrar por autor
  const handleFilterAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await filterBooksByAuthor(filterAuthor);
      setBooks(data);
    } catch (error) {
      console.error('Error filtering books by author:', error);
    }
  };

  // Filtrar por año
  const handleFilterYear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await filterBooksByYear(Number(filterYear));
      setBooks(data);
    } catch (error) {
      console.error('Error filtering books by year:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Buscar por título, autor o género"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      <form onSubmit={handleFilterAuthor} style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Filtrar por autor"
          value={filterAuthor}
          onChange={e => setFilterAuthor(e.target.value)}
        />
        <button type="submit">Filtrar autor</button>
      </form>

      <form onSubmit={handleFilterYear} style={{ marginBottom: 16 }}>
        <input
          type="number"
          placeholder="Filtrar por año"
          value={filterYear}
          onChange={e => setFilterYear(e.target.value)}
        />
        <button type="submit">Filtrar año</button>
      </form>

      <BookDataTable books={books} />
    </div>
  );
};

export default BookIndex;
