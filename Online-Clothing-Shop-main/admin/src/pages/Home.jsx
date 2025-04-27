import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Home() {
  const [products, setProducts] = useState([]); // State to store all active products
  const [filteredProducts, setFilteredProducts] = useState([]); // State to store filtered products
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(""); // State to handle errors
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedCategory, setSelectedCategory] = useState("All"); // State for selected category
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user); // Access current user from Redux

  // Fetch active products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product/active");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products); // Set active products in state
        setFilteredProducts(data.products); // Initialize filtered products
      } catch (error) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchProducts();
  }, []);

  // Handle search and category filter
  useEffect(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered); // Update filtered products
  }, [searchQuery, selectedCategory, products]);

  // Handle adding a product to the cart
  const handleAddToCart = async (productId, quantity) => {
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
        body: JSON.stringify({ productId, quantity, userId: currentUser._id }),
      });
      if (response.ok) {
        alert("Product added to cart successfully!");
        navigate(`/cartpage/${currentUser._id}`);
      } else {
        throw new Error("Failed to add product to cart");
      }
    } catch (error) {
      alert("Failed to add product to cart.");
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-[#F5F3F4] min-h-screen">
      <div className="p-8">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-8">
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-[#660708] rounded-xl shadow-sm focus:outline-none focus:ring-[#660708] focus:border-[#660708] bg-white/80 text-[#161A1D]"
            />
          </div>

          <div className="relative w-full sm:w-1/4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-[#660708] rounded-xl shadow-sm focus:outline-none focus:ring-[#660708] focus:border-[#660708] bg-white/80 text-[#161A1D]"
            >
              <option value="All">All</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kid">Kid</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
        </div>

        {/* Display filtered products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}