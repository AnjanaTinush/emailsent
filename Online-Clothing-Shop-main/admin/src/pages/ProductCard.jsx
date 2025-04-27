import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleViewProduct = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-[#EDEDED]">
      <div className="relative overflow-hidden rounded-xl cursor-pointer group">
        <img
          src={`http://localhost:3000/uploads/${product.image}`}
          alt={product.productName}
          className="w-full h-56 object-cover transform transition-transform duration-300 group-hover:scale-110 rounded-xl"
          onClick={handleViewProduct}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-xl"></div>
      </div>

      <h2
        className="text-2xl font-bold text-[#161A1D] mt-4 cursor-pointer hover:text-[#D90429] transition-colors duration-300"
        onClick={handleViewProduct}
      >
        {product.productName}
      </h2>

      <p className="text-[#D90429] text-lg font-semibold mt-2">${product.price}</p>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <label className="block text-sm font-medium text-[#161A1D] mb-1">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            className="w-20 px-3 py-2 border border-[#D90429] rounded-lg shadow-sm focus:outline-none focus:ring-[#D90429] focus:border-[#D90429] text-sm bg-white/80"
          />
        </div>

        <button
          onClick={() => onAddToCart(product._id, quantity)}
          className="mt-6 bg-[#D90429] text-white py-2 px-4 rounded-lg hover:bg-[#B70422] focus:outline-none focus:ring-2 focus:ring-[#D90429] focus:ring-offset-2 transition-colors duration-300 shadow-md"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
