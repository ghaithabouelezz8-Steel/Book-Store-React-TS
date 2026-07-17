import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import Register from './pages/Register';
import CartDrawer from '../components/CartDrawer'; // Adjusted path check if needed

export default function App() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        
        {/* Global Navigation Header Bar */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            <Link to="/" className="text-xl font-bold text-indigo-600 tracking-tight flex items-center gap-2">
              📚 TSBookstore
            </Link>

            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                Catalog
              </Link>

              {/* Authentication Actions */}
              {user ? (
                <>
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium hidden sm:inline-block">
                    {user.email} ({user.role})
                  </span>
                  <button 
                    onClick={logout}
                    className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-semibold transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                    Login
                  </Link>
                  <Link to="/register" className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-semibold transition">
                    Register
                  </Link>
                </>
              )}

              {/* Floating Cart Launcher Button */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition flex items-center gap-1 font-semibold text-sm border border-gray-100 bg-white shadow-sm"
              >
                <span>🛒 Cart</span>
                {cartCount > 0 && (
                  <span className="bg-indigo-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </nav>

        {/* Dynamic Route Content Space */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        {/* Global Sidebar Cart Element */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      </div>
    </Router>
  );
}