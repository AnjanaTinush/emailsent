import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { employeeLogout } from "../../redux/employee/employeeSlice";

export default function EditProduct() {
  const { id } = useParams(); // Get product ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const dispatch = useDispatch();

  const [product, setProduct] = useState({
    productName: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "",
    status: "active",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null); // State for the new image file
  const [imagePreview, setImagePreview] = useState(""); // State for image preview

  // Fetch product details by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        // Prepend the backend base URL to the image path
        const productWithImageUrl = {
          ...data.product,
          image: data.product.image
            ? `http://localhost:3000/uploads/${data.product.image}`
            : "",
        };
        setProduct(productWithImageUrl); // Set product details in state
        setImagePreview(productWithImageUrl.image); // Set image preview
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Display the selected image immediately
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("productName", product.productName);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("quantity", product.quantity);
      formData.append("category", product.category);
      formData.append("status", product.status);
      if (imageFile) {
        formData.append("image", imageFile); // Append the new image file
      }

      const response = await fetch(`/api/product/update/${id}`, {
        method: "PUT",
        body: formData, // Send form data (including image)
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const data = await response.json();
      console.log("Product updated successfully:", data);

      // Navigate back to the View Products page
      navigate("/viewproducts");
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product");
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
        <h1 className="text-3xl font-extrabold text-[#161A1D] mb-8">Edit Product</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col">
          <div className="flex">
          <div className="m-3 w-1/2">
          {/* Product Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#161A1D] mb-2">Product Name</label>
            <input
              type="text"
              name="productName"
              value={product.productName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#161A1D] mb-2">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
              required
            />
          </div>

          {/* Price */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#161A1D] mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
              required
            />
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#161A1D] mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
              required
            />
          </div></div>
          <div className="m-3 w-1/2">
          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#161A1D] mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
              required
            />
          </div>

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#161A1D] mb-2">Status</label>
            <select
              name="status"
              value={product.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#161A1D] mb-2">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Product"
                className="mt-2 w-32 h-32 object-cover rounded-md"
              />
            )}
          </div>
          </div></div>
          {/* Submit Button */}
          <div className="flex justify-center">
          <button
            type="submit"
            className="w-3/5 bg-[#660708] text-[#F5F3F4] px-6 py-2 rounded-lg hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all "
          >
            Update Product
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}