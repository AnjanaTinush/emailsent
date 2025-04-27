import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Star Rating Component
const StarRating = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className={`text-2xl transition-colors duration-200 ${star <= (hoverRating || rating) ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default function OrdersPage() {
  const { id } = useParams();
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({});
  const [rating, setRating] = useState({});
  const [submittedFeedback, setSubmittedFeedback] = useState({});
  const [editMode, setEditMode] = useState({});

  useEffect(() => {
    const fetchCheckouts = async () => {
      try {
        const response = await fetch(`/api/checkout/checkouts/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch checkouts");
        }
        const data = await response.json();
        setCheckouts(data);

        const feedbackPromises = data.map(async (checkout) => {
          if (checkout.status === "Delivered") {
            const feedbackResponse = await fetch(`/api/feedback/order/${checkout._id}`);
            if (feedbackResponse.ok) {
              const feedbackData = await feedbackResponse.json();
              setSubmittedFeedback((prev) => ({
                ...prev,
                [checkout._id]: feedbackData,
              }));
            }
          }
        });

        await Promise.all(feedbackPromises);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckouts();
  }, [id]);

  const handleFeedbackChange = (orderId, value) => {
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [orderId]: value,
    }));
  };

  const handleRatingChange = (orderId, value) => {
    setRating((prevRating) => ({
      ...prevRating,
      [orderId]: value,
    }));
  };

  const handleSubmitFeedback = async (orderId) => {
    try {
      const response = await fetch(`/api/feedback/add/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback: feedback[orderId],
          rating: rating[orderId] || 5,
          userId: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      const data = await response.json();
      alert("Feedback submitted successfully!");

      setSubmittedFeedback((prev) => ({
        ...prev,
        [orderId]: data.feedback,
      }));

      setFeedback((prev) => ({ ...prev, [orderId]: "" }));
      setRating((prev) => ({ ...prev, [orderId]: 0 }));
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback");
    }
  };

  const handleUpdateFeedback = async (orderId) => {
    try {
      const response = await fetch(`/api/feedback/update/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback: feedback[orderId],
          rating: rating[orderId] || 5,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update feedback");
      }

      const data = await response.json();
      alert("Feedback updated successfully!");

      setSubmittedFeedback((prev) => ({
        ...prev,
        [orderId]: data.feedback,
      }));

      setEditMode((prev) => ({ ...prev, [orderId]: false }));
    } catch (error) {
      console.error("Error updating feedback:", error);
      alert("Failed to update feedback");
    }
  };

  const handleDeleteFeedback = async (orderId) => {
    try {
      const response = await fetch(`/api/feedback/delete/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete feedback");
      }

      alert("Feedback deleted successfully!");
      setSubmittedFeedback((prev) => {
        const updatedFeedback = { ...prev };
        delete updatedFeedback[orderId];
        return updatedFeedback;
      });
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alert("Failed to delete feedback");
    }
  };

  const toggleEditMode = (orderId) => {
    setEditMode((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (checkouts.length === 0) {
    return <div className="text-center mt-8">No orders found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">My Orders</h1>

      <div className="space-y-8">
        {checkouts.map((checkout) => (
          <div key={checkout._id} className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="w-1/3">
                <h2 className="text-xl font-semibold text-gray-800">Order ID: {checkout._id}</h2>
                <p className="text-gray-600">Status: {checkout.status}</p>
                <p className="text-gray-600">Total: <span className="font-semibold text-indigo-600">${checkout.totalPrice}</span></p>
                <p className="text-gray-600">Date: {new Date(checkout.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Items Section */}
              <div className="w-2/3">
                <h3 className="text-lg font-medium text-gray-800">Items</h3>
                <div className="space-y-3">
                  {checkout.items.map((item) => (
                    <div key={item.productId._id} className="bg-gray-50 p-3 rounded-md shadow-sm">
                      <p className="text-gray-700">{item.productId.productName}</p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-gray-600">Price: ${item.productId.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Receipt Section */}
            {checkout.receipt && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-800">Receipt:</h3>
                <a
                  href={`http://localhost:3000/uploads/${checkout.receipt}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Download Receipt
                </a>
              </div>
            )}

            {/* Feedback Section */}
            {checkout.status === "Delivered" && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">Feedback:</h3>
                {submittedFeedback[checkout._id] ? (
                  <div className="space-y-4">
                    {editMode[checkout._id] ? (
                      <div className="space-y-3">
                        <textarea
                          value={feedback[checkout._id] || submittedFeedback[checkout._id].feedback}
                          onChange={(e) => handleFeedbackChange(checkout._id, e.target.value)}
                          placeholder="Share your feedback..."
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          rows="4"
                        />
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700">Rating:</label>
                          <StarRating
                            rating={rating[checkout._id] || submittedFeedback[checkout._id].rating}
                            onRatingChange={(value) => handleRatingChange(checkout._id, value)}
                          />
                        </div>
                        <div className="flex space-x-4 mt-4">
                          <button
                            onClick={() => handleUpdateFeedback(checkout._id)}
                            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            Update Feedback
                          </button>
                          <button
                            onClick={() => toggleEditMode(checkout._id)}
                            className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-gray-700">{submittedFeedback[checkout._id].feedback}</p>
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700">Rating:</label>
                          <StarRating rating={submittedFeedback[checkout._id].rating} />
                        </div>
                        <div className="flex space-x-4 mt-4">
                          <button
                            onClick={() => toggleEditMode(checkout._id)}
                            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            Edit Feedback
                          </button>
                          <button
                            onClick={() => handleDeleteFeedback(checkout._id)}
                            className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Delete Feedback
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={feedback[checkout._id] || ""}
                      onChange={(e) => handleFeedbackChange(checkout._id, e.target.value)}
                      placeholder="Share your feedback..."
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows="4"
                    />
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">Rating:</label>
                      <StarRating
                        rating={rating[checkout._id] || 0}
                        onRatingChange={(value) => handleRatingChange(checkout._id, value)}
                      />
                    </div>
                    <button
                      onClick={() => handleSubmitFeedback(checkout._id)}
                      className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
