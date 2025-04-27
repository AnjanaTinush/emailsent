import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("Men"); // Default category
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(""); // State for image preview
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!productName || !description || !price || !quantity || !category) {
      setError("All fields are required");
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("category", category);
    if (image) {
      formData.append("image", image); // Append the image file
    }

    try {
      setLoading(true);
      setError("");

      // Send POST request to the backend using fetch
      const response = await fetch("/api/product/add", {
        method: "POST",
        body: formData, // No need to set headers manually for FormData
      });

      // Handle response
      if (response.ok) {
        const data = await response.json();
        alert("Product added successfully!");
        navigate("/viewproducts"); // Redirect to the products list page
      } else {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      setError("An error occurred while adding the product");
    } finally {
      setLoading(false);
    }
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Set the image file
      setImagePreview(URL.createObjectURL(file)); // Generate a preview URL
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3F4]">
      {/* Header */}
      <header className="bg-[#161A1D] shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#F5F3F4]">Employee Dashboard</h1>
          <button
            onClick={() => navigate("/viewproducts")}
            className="bg-[#660708] text-[#F5F3F4] px-6 py-2 rounded-lg hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
          >
            Back to Products
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-[#161A1D] mb-8">Add New Product</h1>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}

        {/* Product form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-[#161A1D] mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#161A1D] mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
                rows="3"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-[#161A1D] mb-2">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-[#161A1D] mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-[#161A1D] mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
                required
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kid">Kid</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-[#161A1D] mb-2">
                Product Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
                accept="image/jpeg, image/png, image/gif"
              />
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Product Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-[#660708] text-[#F5F3F4] px-6 py-3 rounded-lg hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}