import React, { useState } from "react";
import { Link } from "react-router-dom"; // If you're using React Router for navigation

const CartPage = () => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []); // Cart from localStorage

  // Remove product from cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update cart in localStorage
  };

  // Update product quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update cart in localStorage
  };

  // Calculate total price
  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.salePrice * item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">Your cart is empty.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {cart.map((item) => (
                <div key={item.productId} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <img
                      src={item.productImage} // Display the image added to the cart
                      alt={item.productName}
                      className="h-72 w-full object-cover rounded-t-lg mb-4"
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.productName}</h2>
                  <p className="text-gray-800 font-medium mb-2">${item.salePrice.toFixed(2)} each</p>
                  <div className="mb-4">
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                      className="w-16 p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
                    Subtotal: ${(item.salePrice * item.quantity).toFixed(2)}
                  </p>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-500"
                  >
                    Remove from Cart
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 text-right">
              <p className="text-xl font-semibold">Total Amount: ${getTotalAmount().toFixed(2)}</p>

              {/* Checkout Button */}
              <button
                onClick={() => alert('Proceed to Checkout')}
                className="mt-4 py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
