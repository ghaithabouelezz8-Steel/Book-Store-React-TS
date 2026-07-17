import React, { useState } from 'react';
import { useCart } from '../src/context/CartContext';// Adjusted path check if needed
import { useAuth } from '../src/context/AuthContext';   // 👈 1. Import your useAuth hook
import api from '../src//utils/api'; 

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount, clearCart } = useCart();
  const { user } = useAuth(); // 👈 2. Extract your active user context state
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    // 1. Clean check using our synchronized interface key
    if (!user || !user.id) {
      alert("Please log into your account to complete this checkout transaction! 🔐");
      return;
    }

    setIsProcessing(true);
    try {
      const payload = cart.map(item => ({
        id: item.id,
        quantity: item.quantity
      }));

      const response = await api.post('/orders/checkout', {
        items: payload,
        userId: user.id // 👈 2. Pass the exact valid user ID string
      });

      alert(response.data.message);
      clearCart(); 
      onClose();   
      window.location.reload(); 

    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "An error occurred during checkout processing.");
    } finally {
      setIsProcessing(false);
    }
  };;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark overlay backdrop */}
      <div 
        className="absolute inset-0 bg-gray-600/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-in">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              🛒 Your Cart <span className="text-sm bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full font-semibold">{cartCount}</span>
            </h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-500 p-1.5 rounded-lg hover:bg-gray-50 transition"
            >
              ✕
            </button>
          </div>

          {/* Drawer Body / Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                <span className="text-5xl mb-3">📚</span>
                <p className="text-base font-medium">Your shopping cart is empty</p>
                <p className="text-xs mt-1 max-w-xs">Add some software engineering masterclasses to get started!</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 border-b border-gray-50 pb-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                    <p className="text-sm font-black text-indigo-600 mt-0.5">${item.price.toFixed(2)}</p>
                  </div>

                  {/* Quantity Control Buttons */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-gray-500 hover:bg-gray-200 transition font-medium"
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-bold text-gray-800">{item.quantity}</span>
                    <button 
                      disabled={item.quantity >= item.stock}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-gray-500 hover:bg-gray-200 transition font-medium disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 p-1 text-sm font-medium transition"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Summary Block */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/70">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Subtotal</p>
                <p className="text-xl font-black text-gray-900">${cartTotal.toFixed(2)}</p>
              </div>
              <p className="text-xs text-gray-400 mb-4">Shipping and handling taxes calculated at checkout routing.</p>
              
              <button 
                disabled={isProcessing}
                onClick={handleCheckout} // 👈 3. Direct execution routing link
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? "Processing Transaction..." : "Proceed to Checkout 🚀"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}