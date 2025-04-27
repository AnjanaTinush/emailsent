import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

export default function CartPage() {
  const { id } = useParams(); // Get userId from the URL
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch cart details
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`/api/cart/getcart/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }
        const data = await response.json();
        setCart(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [id]);

  // Update product quantity
  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const response = await fetch(`/api/cart/${id}/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const updatedCart = await response.json();

      // Update the cart state immutably
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.map((item) =>
          item.productId._id === productId
            ? { ...item, quantity: parseInt(quantity, 10) }
            : item
        ),
        totalPrice: updatedCart.cart.totalPrice, // Update total price
      }));
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    }
  };

  // Delete a product from the cart
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`/api/cart/${id}/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      const updatedCart = await response.json();

      if (updatedCart.cart === null) {
        // If the cart is deleted, set cart to null
        setCart(null);
      } else {
        // Otherwise, update the cart state immutably
        setCart((prevCart) => ({
          ...prevCart,
          items: prevCart.items.filter((item) => item.productId._id !== productId),
          totalPrice: updatedCart.cart.totalPrice, // Update total price
        }));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    navigate(`/checkout/${id}`); // Navigate to the checkout page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-[#161A1D]">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-[#660708]">{error}</div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-[#161A1D]">Your cart is empty.</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F5F3F4] min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-[#161A1D] mb-10">My Cart</h1>

      {/* Container with two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section: Cart Items */}
        <div className="space-y-8">
          {cart.items.map((item) => (
            <div
              key={item.productId._id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#161A1D]">
                  {item.productId.productName}
                </h2>
                <p className="text-lg text-[#660708]">${item.productId.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="mt-4 flex items-center space-x-4">
                <label className="block text-sm font-medium text-[#161A1D]">Quantity</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateQuantity(item.productId._id, e.target.value)
                  }
                  min="1"
                  className="w-20 px-3 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] text-sm"
                />
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteProduct(item.productId._id)}
                className="mt-6 bg-[#660708] text-[#F5F3F4] py-2 px-4 rounded-md hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Right Section: Subtotal and Checkout */}
        <div className="space-y-6">
          {/* Subtotal */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h2 className="text-2xl font-semibold text-[#161A1D] mb-4">Subtotal</h2>
            <p className="text-xl text-[#660708]">Total: ${cart.totalPrice}</p>
          </div>

          {/* Checkout Button */}
          <div>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#660708] text-[#F5F3F4] py-3 px-6 rounded-lg hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}