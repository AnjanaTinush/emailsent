import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { employeeLogout } from "../../redux/employee/employeeSlice";
import jsPDF from 'jspdf';

export default function ViewCheckouts() {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusUpdateMessage, setStatusUpdateMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Add truncate text helper
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Add filter function for checkouts
  const filteredCheckouts = checkouts.filter((checkout) =>
    checkout.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checkout.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checkout.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checkout.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

const generateReport = () => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.setTextColor(102, 7, 8); // #660708 color for title
  doc.text('Checkouts Report', 14, 20);
  
  // Add current date
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0); // Reset to black
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Define column positions and widths
  const columns = [
    { header: 'User', x: 14, width: 40 },
    { header: 'Email', x: 54, width: 60 },
    { header: 'Total Price', x: 114, width: 30 },
    { header: 'Status', x: 144, width: 30 },
    { header: 'Date', x: 174, width: 30 }
  ];
  
  let yPos = 40;
  
  // Set font size for table and header color
  doc.setFontSize(10);
  doc.setTextColor(102, 7, 8); // #660708 color for table headers
  doc.setFont(undefined, 'bold');
  
  // Add headers
  columns.forEach(column => {
    doc.text(column.header, column.x, yPos);
  });
  
  // Add horizontal line
  yPos += 2;
  doc.setDrawColor(102, 7, 8); // #660708 color for the line
  doc.line(14, yPos, 196, yPos);
  yPos += 6;
  
  // Reset to normal font for table data
  doc.setFont(undefined, 'normal');
  doc.setTextColor(0, 0, 0); // Reset to black for data
  
  // Add checkout data
  filteredCheckouts.forEach((checkout) => {
    // Check if we need a new page
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
      
      // Add headers on new page
      doc.setTextColor(102, 7, 8);
      doc.setFont(undefined, 'bold');
      columns.forEach(column => {
        doc.text(column.header, column.x, yPos);
      });
      
      // Add horizontal line
      yPos += 2;
      doc.setDrawColor(102, 7, 8);
      doc.line(14, yPos, 196, yPos);
      yPos += 6;
      
      // Reset to normal font for table data
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
    }
    
    // User
    doc.text(truncateText(checkout.userId?.username || 'N/A', 18), columns[0].x, yPos);
    
    // Email
    doc.text(truncateText(checkout.email || '', 25), columns[1].x, yPos);
    
    // Total Price
    doc.text(`$${checkout.totalPrice}` || '', columns[2].x, yPos);
    
    // Set status color based on value
    let statusColor;
    switch(checkout.status) {
      case 'Delivered':
        statusColor = [34, 197, 94]; // green
        break;
      case 'Cancelled':
        statusColor = [220, 38, 38]; // red
        break;
      case 'Refund':
        statusColor = [59, 130, 246]; // blue
        break;
      case 'Processing':
        statusColor = [234, 179, 8]; // yellow/amber
        break;
      case 'Shipped':
        statusColor = [245, 158, 11]; // orange
        break;
      case 'Pending':
        statusColor = [156, 163, 175]; // gray
        break;
      default:
        statusColor = [0, 0, 0]; // black
    }
    
    // Apply color for status
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(checkout.status || '', columns[3].x, yPos);
    
    // Reset to black for date
    doc.setTextColor(0, 0, 0);
    doc.text(new Date(checkout.createdAt).toLocaleDateString() || '', columns[4].x, yPos);
    
    // Add a light gray separator line between rows
    yPos += 1;
    doc.setDrawColor(230, 230, 230);
    doc.line(14, yPos, 196, yPos);
    yPos += 6;
  });
  
  // Save the PDF
  doc.save('checkouts-report.pdf');
};

  // Fetch all checkouts
  useEffect(() => {
    const fetchCheckouts = async () => {
      try {
        const response = await fetch("/api/checkout");
        if (!response.ok) {
          throw new Error("Failed to fetch checkouts");
        }
        const data = await response.json();
        setCheckouts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckouts();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (checkoutId, status, previousStatus) => {
    try {
      // If status is changing to "Refund", show confirmation dialog
      if (status === "Refund" && previousStatus !== "Refund") {
        const confirmRefund = window.confirm(
          "Are you sure you want to process a refund for this order? An email notification will be sent to the customer."
        );
        
        if (!confirmRefund) {
          // Reset the select dropdown to previous value if user cancels
          setCheckouts((prevCheckouts) =>
            prevCheckouts.map((checkout) =>
              checkout._id === checkoutId
                ? { ...checkout, status: previousStatus }
                : checkout
            )
          );
          return;
        }
      }

      const response = await fetch(`/api/checkout/${checkoutId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const data = await response.json();

      // Update the checkout status in the state
      setCheckouts((prevCheckouts) =>
        prevCheckouts.map((checkout) =>
          checkout._id === checkoutId ? { ...checkout, status: data.checkout.status } : checkout
        )
      );

      // Show appropriate message based on status
      if (status === "Refund") {
        setStatusUpdateMessage(`Refund processed successfully! Email notification sent to customer.`);
      } else {
        setStatusUpdateMessage("Status updated successfully!");
      }
      
      // Clear the message after 5 seconds
      setTimeout(() => {
        setStatusUpdateMessage("");
      }, 5000);
      
    } catch (error) {
      console.error("Error updating status:", error);
      setStatusUpdateMessage(`Error: ${error.message}`);
      
      // Clear the error message after 5 seconds
      setTimeout(() => {
        setStatusUpdateMessage("");
      }, 5000);
    }
  };

  // Handle checkout deletion
  const handleDeleteCheckout = async (checkoutId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this checkout record? This action cannot be undone."
      );
      
      if (!confirmDelete) {
        return;
      }
      
      const response = await fetch(`/api/checkout/${checkoutId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete checkout");
      }

      // Remove the deleted checkout from the state
      setCheckouts((prevCheckouts) =>
        prevCheckouts.filter((checkout) => checkout._id !== checkoutId)
      );

      setStatusUpdateMessage("Checkout deleted successfully!");
      
      // Clear the message after 5 seconds
      setTimeout(() => {
        setStatusUpdateMessage("");
      }, 5000);
      
    } catch (error) {
      console.error("Error deleting checkout:", error);
      setStatusUpdateMessage(`Error: ${error.message}`);
      
      // Clear the error message after 5 seconds
      setTimeout(() => {
        setStatusUpdateMessage("");
      }, 5000);
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
        {/* Title and Search Section */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h1 className="text-3xl font-extrabold text-[#161A1D]">All Checkouts</h1>
              {error && (
                <p className="text-sm text-[#660708] mt-1">Error: {error}</p>
              )}
            </div>
          </div>

          {/* Status Update Message */}
          {statusUpdateMessage && (
            <div className={`px-4 py-3 rounded-lg ${statusUpdateMessage.includes("Error") 
              ? "bg-red-100 text-red-800 border border-red-300" 
              : statusUpdateMessage.includes("Refund") 
                ? "bg-blue-100 text-blue-800 border border-blue-300"
                : "bg-green-100 text-green-800 border border-green-300"}`}>
              {statusUpdateMessage}
            </div>
          )}

          {/* Search Bar and Generate Report Button */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search checkouts..."
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
            <Link to="/checkoutsummary">
              <button
                className="bg-[#660708] text-[#F5F3F4] px-6 py-2 rounded-lg hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all whitespace-nowrap"
              >
                Summary section
              </button>
            </Link>
          </div>
        </div>

        {/* Checkouts Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#161A1D]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Total Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F3F4]">
              {filteredCheckouts.length > 0 ? (
                filteredCheckouts.map((checkout) => (
                  <tr
                    key={checkout._id}
                    className="hover:bg-[#F5F3F4] transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                      {checkout.userId?.username || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                      {checkout.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                      ${checkout.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                      <select
                        value={checkout.status}
                        onChange={(e) => handleStatusUpdate(checkout._id, e.target.value, checkout.status)}
                        className={`px-2 py-1 rounded-full text-sm ${
                          checkout.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : checkout.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : checkout.status === "Refund"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Refund">Refund</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                      {new Date(checkout.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/checkoutdetails/${checkout._id}`}
                        className="bg-[#660708] text-[#F5F3F4] px-4 py-2 rounded-md hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleDeleteCheckout(checkout._id)}
                        className="ml-2 bg-[#660708] text-[#F5F3F4] px-4 py-2 rounded-md hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-8 whitespace-nowrap text-sm text-center text-gray-500"
                  >
                    {searchTerm
                      ? "No checkouts found matching your search."
                      : "No checkouts available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}