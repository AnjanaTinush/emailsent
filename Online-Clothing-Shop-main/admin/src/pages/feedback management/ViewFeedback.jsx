import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { employeeLogout } from "../../redux/employee/employeeSlice";
import jsPDF from 'jspdf';

export default function ViewFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const filteredFeedback = feedback.filter((fb) =>
    fb.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fb.orderId?._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fb.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fb.rating?.toString().includes(searchTerm)
  );

  const generateReport = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Feedback Report', 14, 20);
    
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    const headers = ['User', 'Order ID', 'Feedback', 'Rating', 'Date'];
    let yPos = 40;
    
    doc.setFontSize(10);
    
    headers.forEach((header, i) => {
      doc.text(header, 14 + (i * 38), yPos);
    });
    
    yPos += 2;
    doc.line(14, yPos, 196, yPos);
    yPos += 6;
    
    filteredFeedback.forEach((fb) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.text(fb.userId?.username || 'N/A', 14, yPos);
      doc.text(fb.orderId?._id || 'N/A', 52, yPos);
      doc.text(truncateText(fb.feedback, 30) || '', 90, yPos);
      doc.text(fb.rating?.toString() || '', 128, yPos);
      doc.text(new Date(fb.createdAt).toLocaleDateString() || '', 166, yPos);
      
      yPos += 7;
    });
    
    doc.save('feedback-report.pdf');
  };

  // Fetch all feedback
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch("/api/feedback");
        if (!response.ok) {
          throw new Error("Failed to fetch feedback");
        }
        const data = await response.json();
        setFeedback(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Handle feedback deletion
  const handleDeleteFeedback = async (feedbackId) => {
    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete feedback");
      }

      // Remove the deleted feedback from the state
      setFeedback((prevFeedback) =>
        prevFeedback.filter((fb) => fb._id !== feedbackId)
      );

      alert("Feedback deleted successfully!");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alert("Failed to delete feedback");
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
              <h1 className="text-3xl font-extrabold text-[#161A1D]">All Feedback</h1>
              {error && (
                <p className="text-sm text-[#660708] mt-1">Error: {error}</p>
              )}
            </div>
          </div>

          {/* Search Bar and Generate Report Button */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search feedback..."
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
        </div>

        {/* Feedback Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#161A1D]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Feedback
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Rating
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
              {filteredFeedback.length > 0 ? (
                filteredFeedback.map((fb) => (
                  <tr
                    key={fb._id}
                    className="hover:bg-[#F5F3F4] transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                      {fb.userId?.username || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                      {fb.orderId?._id || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                      <span title={fb.feedback}>
                        {truncateText(fb.feedback, 20)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            className={`text-2xl ${
                              index < fb.rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteFeedback(fb._id)}
                        className="bg-[#660708] text-[#F5F3F4] px-4 py-2 rounded-md hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 whitespace-nowrap text-sm text-center text-gray-500"
                  >
                    {searchTerm
                      ? "No feedback found matching your search."
                      : "No feedback available."}
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