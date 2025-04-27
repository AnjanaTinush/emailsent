import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { employeeLogout } from "../../redux/employee/employeeSlice";

export default function ViewUserDetail() {
  const { id } = useParams(); // Get the userId from the URL
  const [user, setUser] = useState(null); // State to store the user details
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch user details from the backend
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!id) {
        setError("User ID is undefined");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching user details for ID:", id); // Debugging
        const response = await fetch(`/api/users/user/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        console.log("User data:", data); // Debugging
        setUser(data); // Set the fetched user details to state
        setLoading(false); // Set loading to false
      } catch (err) {
        console.error("Error fetching user details:", err); // Debugging
        setError(err.message); // Set error message
        setLoading(false); // Set loading to false
      }
    };

    fetchUserDetails();
  }, [id]); // Add userId to the dependency array

  // Handle back to users list
  const handleBack = () => {
    navigate("/viewuser"); // Navigate back to the users list page
  };

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

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-[#161A1D]">User not found</div>
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
        <h1 className="text-3xl font-extrabold text-[#161A1D] mb-6">User Details</h1>

        {/* Back button */}
        

        {/* User details card */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#161A1D]">Username</label>
              <p className="text-lg text-[#161A1D]">{user.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#161A1D]">Email</label>
              <p className="text-lg text-[#161A1D]">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#161A1D]">Mobile</label>
              <p className="text-lg text-[#161A1D]">{user.mobile}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#161A1D]">Address</label>
              <p className="text-lg text-[#161A1D]">{user.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}