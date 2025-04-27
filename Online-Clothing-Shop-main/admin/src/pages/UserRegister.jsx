import { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../images/background.jpg";

export default function UserRegister() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (
      !formData.username ||
      !formData.email ||
      !formData.mobile ||
      !formData.address ||
      !formData.password
    ) {
      return setError("Please fill all the fields");
    }

    try {
      setLoading(true);
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      if (res.ok) {
        navigate("/login"); // Redirect to login page after successful registration
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark overlay */}
      <div className="relative z-10 bg-white bg-opacity-80 p-10 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center text-red-600 mb-8">Sign Up</h1>
        
        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            className="border-2 border-red-500 p-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
            id="username"
            onChange={handleChange}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="border-2 border-red-500 p-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
            id="email"
            onChange={handleChange}
          />

          {/* Mobile */}
          <input
            type="text"
            placeholder="Mobile"
            className="border-2 border-red-500 p-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
            id="mobile"
            onChange={handleChange}
          />

          {/* Address */}
          <input
            type="text"
            placeholder="Address"
            className="border-2 border-red-500 p-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
            id="address"
            onChange={handleChange}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="border-2 border-red-500 p-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
            id="password"
            onChange={handleChange}
          />

          {/* Submit Button */}
          <button
            disabled={loading}
            className={`${
              loading
                ? "opacity-80 cursor-not-allowed bg-red-400"
                : "bg-red-500 hover:bg-red-600"
            } text-white py-3 px-8 rounded-full mt-4 transition-all duration-300`}
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        {/* Error message */}
        {error && <p className="text-red-500 mt-3 text-center text-lg">{error}</p>}

        {/* Login Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-red-600 cursor-pointer hover:underline"
            >
              Log in here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
