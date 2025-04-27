import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { employeeLogout } from "../../redux/employee/employeeSlice";

export default function CheckoutDetails() {
  const { checkoutId } = useParams(); // Get checkout ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const dispatch = useDispatch();

  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch checkout details
  useEffect(() => {
    const fetchCheckoutDetails = async () => {
      try {
        const response = await fetch(`/api/checkout/${checkoutId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch checkout details");
        }
        const data = await response.json();
        setCheckout(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutDetails();
  }, [checkoutId]);

  // Handle sign out
  const handleSignOut = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");

    // Dispatch the employee logout action
    dispatch(employeeLogout());

    // Navigate to the employee login page
    navigate("/employeeLogin");
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
        <div className="text-lg font-semibold text-[#660708]">Error: {error}</div>
      </div>
    );
  }

  if (!checkout) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-[#161A1D]">Checkout not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3F4]">
      {/* Header */}
      <header className="bg-[#161A1D] shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#F5F3F4]">Employee Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="bg-[#660708] text-[#F5F3F4] px-6 py-2 rounded-lg hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-[#161A1D] mb-8">Checkout Details</h1>

        {/* Checkout Details Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-[#161A1D]">Order ID: {checkout._id}</h2>
          <p className="text-[#161A1D]">User: {checkout.userId?.username || "N/A"}</p>
          <p className="text-[#161A1D]">Email: {checkout.email}</p>
          <p className="text-[#161A1D]">Phone: {checkout.phoneNumber}</p>
          <p className="text-[#161A1D]">Address: {checkout.address}</p>
          <p className="text-[#161A1D]">Total Price: ${checkout.totalPrice}</p>
          <p className="text-[#161A1D]">Status: {checkout.status}</p>
          <p className="text-[#161A1D]">Date: {new Date(checkout.createdAt).toLocaleDateString()}</p>

          {/* Display Items */}
          <div className="mt-4">
            <h3 className="text-md font-semibold text-[#161A1D]">Items:</h3>
            <div className="space-y-2">
              {checkout.items.map((item) => (
                <div key={item.productId._id} className="bg-[#F5F3F4] p-3 rounded-md">
                  <p className="text-[#161A1D] font-medium">{item.productId.productName}</p>
                  <p className="text-[#161A1D]">Quantity: {item.quantity}</p>
                  <p className="text-[#161A1D]">Price: ${item.productId.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}