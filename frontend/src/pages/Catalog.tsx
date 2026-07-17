import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';


interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  coverImage?: string;
}

export default function Catalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Change this endpoint if your backend route for fetching all books is different
        const response = await api.get('/books');
        setBooks(response.data);
      } catch (err: any) {
        setError('Failed to load book catalog. Make sure books exist in the database.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-center">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Explore Our Collection</h1>
        <p className="text-gray-500 mt-1">Find your next favorite software engineering architecture guide or developer story.</p>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-lg">The shelves are currently empty!</p>
          <p className="text-sm text-gray-400 mt-1">Log into your database or admin panel to seed some book data items.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
              <div className="h-48 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4 border-b border-gray-100">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="h-full object-contain shadow-md rounded" />
                ) : (
                  <span className="text-4xl">📖</span>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                    Stock: {book.stock} left
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-2 line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-gray-500 font-medium">by {book.author}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{book.description}</p>
                </div>
                
                <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xl font-black text-gray-900">${book.price.toFixed(2)}</span>
                  <button 
                    disabled={book.stock === 0}
                    onClick={() => addToCart(book)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}