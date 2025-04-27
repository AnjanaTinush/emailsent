import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { employeeLogout } from "../../redux/employee/employeeSlice"; // Import the employee logout action

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle sign out
  const handleSignOut = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");

    // Dispatch the employee logout action
    dispatch(employeeLogout());

    // Navigate to the employee login page
    navigate("/employeeLogin");
  };

  return (
    <div className="min-h-screen bg-[#F5F3F4]">
      {/* Header with Sign Out button */}
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

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Management Card */}
          <div
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer"
            onClick={() => navigate("/viewuser")}
          >
            <h2 className="text-xl font-bold text-[#161A1D] mb-4">User Management</h2>
            <p className="text-[#660708]">Manage and view user details.</p>
          </div>

          {/* Product Management Card */}
          <div
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer"
            onClick={() => navigate("/viewproducts")}
          >
            <h2 className="text-xl font-bold text-[#161A1D] mb-4">Product Management</h2>
            <p className="text-[#660708]">Add, edit, or view products.</p>
          </div>

          {/* Order Management Card */}
          <div
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer"
            onClick={() => navigate("/viewcheckouts")}
          >
            <h2 className="text-xl font-bold text-[#161A1D] mb-4">Order Management</h2>
            <p className="text-[#660708]">View and manage customer orders.</p>
          </div>

          {/* Payment Management Card */}
          <div
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer"
            onClick={() => navigate("/viewcheckouts")}
          >
            <h2 className="text-xl font-bold text-[#161A1D] mb-4">Payment Management</h2>
            <p className="text-[#660708]">Manage payment details and transactions.</p>
          </div>

          {/* Feedback Management Card */}
          <div
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer"
            onClick={() => navigate("/viewfeedback")}
          >
            <h2 className="text-xl font-bold text-[#161A1D] mb-4">Feedback Management</h2>
            <p className="text-[#660708]">View and manage customer feedback.</p>
          </div>
        </div>
      </main>
    </div>
  );
}