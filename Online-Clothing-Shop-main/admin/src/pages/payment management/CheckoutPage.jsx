import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CheckoutPage() {
  const { id } = useParams();
  const [cart, setCart] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartResponse = await fetch(`/api/cart/getcart/${id}`);
        if (!cartResponse.ok) {
          throw new Error("Failed to fetch cart");
        }
        const cartData = await cartResponse.json();
        setCart(cartData);

        const userResponse = await fetch(`/api/users/user/${id}`);
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user details");
        }
        const userData = await userResponse.json();
        setUser(userData);

        setEmail(userData.email);
        setAddress(userData.address || "");
        setPhoneNumber(userData.mobile || "");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceipt(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("userId", id);
      formData.append("address", address);
      formData.append("phoneNumber", mobile);
      formData.append("email", email);
      formData.append("items", JSON.stringify(cart.items));
      formData.append("totalPrice", cart.totalPrice);
      if (receipt) {
        formData.append("receipt", receipt);
      }

      const response = await fetch("/api/checkout/checkout", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit checkout");
      }

      const result = await response.json();
      alert("Checkout successful!");
      console.log("Checkout result:", result);
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Failed to submit checkout");
    }
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
        <div className="text-lg font-semibold text-[#660708]">{error}</div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-[#161A1D]">Your cart is empty.</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F5F3F4] min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-[#161A1D] mb-10">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <h2 className="text-2xl font-semibold text-[#161A1D] mb-6">Cart Items</h2>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.productId._id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
              >
                <h3 className="text-xl font-semibold text-[#161A1D]">
                  {item.productId.productName}
                </h3>
                <p className="text-[#660708]">Quantity: {item.quantity}</p>
                <p className="text-[#660708]">Price: ${item.productId.price}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out mb-8">
            <p className="text-2xl font-semibold text-[#161A1D] mb-4">
              Total: ${cart.totalPrice}
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Address Section (Read-Only) */}
              <div>
                <label className="block text-sm font-medium text-[#161A1D]">Address</label>
                <input
                  type="text"
                  value={address}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-[#660708] rounded-md shadow-sm focus:outline-none"
                />
              </div>

              {/* Phone Number Section (Read-Only) */}
              <div>
                <label className="block text-sm font-medium text-[#161A1D]">Phone Number</label>
                <input
                  type="tel"
                  value={mobile}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-[#660708] rounded-md shadow-sm focus:outline-none"
                />
              </div>

              {/* Email Section (Editable) */}
              <div>
                <label className="block text-sm font-medium text-[#161A1D]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
                />
              </div>

              {/* Receipt Upload Section */}
              <div>
                <label className="block text-sm font-medium text-[#161A1D]">Upload Receipt</label>
                <input
                  type="file"
                  onChange={handleReceiptUpload}
                  className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-[#660708] text-[#F5F3F4] py-3 px-6 rounded-lg hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
                >
                  Place Order
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
