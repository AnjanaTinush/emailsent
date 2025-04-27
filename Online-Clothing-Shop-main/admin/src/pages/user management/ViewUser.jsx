import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { employeeLogout } from "../../redux/employee/employeeSlice";
import jsPDF from 'jspdf';

export default function ViewUser() {
  const [users, setUsers] = useState([]); // State to store the list of users
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to handle errors
  const [searchTerm, setSearchTerm] = useState(""); // Add this new state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch all users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/users"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data); // Set the fetched users to state
        setLoading(false); // Set loading to false
      } catch (err) {
        setError(err.message); // Set error message
        setLoading(false); // Set loading to false
      }
    };

    fetchUsers();
  }, []);

  // Handle view user
  const handleViewUser = (id) => {
    navigate(`/viewuserdetails/${id}`); // Navigate to the user details page
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/users/user/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Remove the deleted user from the state
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      setError(err.message); // Set error message
      console.error("Delete error:", err); // Log the error for debugging
    }
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

  // Add this function to filter users
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add this function to generate PDF report
  const generateReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('User Report', 14, 20);
    
    // Add current date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Table headers
    const headers = ['Username', 'Email', 'Mobile', 'Address'];
    let yPos = 40;
    
    // Set font size for table
    doc.setFontSize(10);
    
    // Add headers
    headers.forEach((header, i) => {
      doc.text(header, 14 + (i * 45), yPos);
    });
    
    // Add horizontal line
    yPos += 2;
    doc.line(14, yPos, 196, yPos);
    yPos += 6;
    
    // Add user data
    filteredUsers.forEach((user) => {
      // Check if we need a new page
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.text(user.username?.toString() || '', 14, yPos);
      doc.text(user.email?.toString() || '', 59, yPos);
      doc.text(user.mobile?.toString() || '', 104, yPos);
      doc.text(user.address?.toString() || '', 149, yPos);
      
      yPos += 7;
    });
    
    // Save the PDF
    doc.save('user-report.pdf');
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
        <h1 className="text-3xl font-extrabold text-[#161A1D] mb-8">View Users</h1>

        {/* Modified Search Bar and Report Button Container */}
        <div className="mb-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-transparent"
          />
          <button
            onClick={generateReport}
            className="bg-[#660708] text-[#F5F3F4] px-6 py-2 rounded-lg hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all whitespace-nowrap"
          >
            Generate Report
          </button>
        </div>

        {/* Table to display users */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#161A1D]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F3F4]">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-[#F5F3F4] transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    {user.mobile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    {user.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleViewUser(user._id)}
                      className="bg-[#660708] text-[#F5F3F4] px-4 py-2 rounded-md hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="ml-2 bg-[#660708] text-[#F5F3F4] px-4 py-2 rounded-md hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}