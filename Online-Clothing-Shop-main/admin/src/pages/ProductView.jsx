import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProductView() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/product/details/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(`/api/feedback/product/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch feedback");
        }
        const data = await response.json();
        setFeedback(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, [productId]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!currentUser) {
      alert("Please sign in to add products to your cart.");
      navigate("/signin");
      return;
    }

    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: product._id, quantity, userId: currentUser._id }),
      });

      if (response.ok) {
        alert("Product added to cart successfully!");
        navigate(`/cartpage/${currentUser._id}`);
      } else {
        throw new Error("Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!product) return <div className="text-center mt-8">Product not found.</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-2xl shadow-md">
        <img
          src={`http://localhost:3000/uploads/${product.image}`}
          alt={product.productName}
          className="w-full md:w-1/2 h-auto object-cover rounded-lg"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{product.productName}</h2>
          <p className="text-xl text-[#660708] mb-4">${product.price}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <div className="flex items-center justify-between space-x-6 mb-6">
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              className="w-56 p-2 border border-gray-300 rounded-md text-gray-800"
            />
            <button
              onClick={handleAddToCart}
              className="bg-[#660708] text-white w-56 px-8 py-2 rounded-lg hover:bg-[#7f0a10] transition"
            >
              Add to Cart
            </button>
          </div>

          {feedback.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Customer Feedback</h3>
              {feedback.map((fb) => (
                <div key={fb._id} className="bg-gray-50 p-4 rounded-md mb-4">
                  <p className="font-semibold">{fb.userId?.username || "Anonymous"} says:</p>
                  <p className="text-gray-600">{fb.feedback}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{fb.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
