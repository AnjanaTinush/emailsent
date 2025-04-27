import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";
import background from "../images/background.jpg";

export default function UserLogin() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/"); 
      } else {
        dispatch(signInFailure(data.message || "Login failed"));
      }
    } catch (error) {
      dispatch(signInFailure(error.message || "Something went wrong"));
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark overlay */}
      <div className="relative z-10 bg-white bg-opacity-80 p-10 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center text-red-600 mb-8">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="email"
            placeholder="Email"
            className="border-2 border-red-500 p-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="border-2 border-red-500 p-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600"
            id="password"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            style={{
              color: "white",
              padding: "0.75rem 2rem",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
            }}
            className={`${
              loading ? "opacity-80 cursor-not-allowed bg-red-400" : "bg-red-500 hover:bg-red-600"
            } text-lg font-semibold mt-4 transition-all ease-in-out duration-200`}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center text-lg">{error}</p>}

        {/* Register Page Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-red-600 cursor-pointer hover:underline"
            >
              Register here
            </span>
          </p>
        </div>

        {/* Employee Login Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Are you an employee?{" "}
            <span
              onClick={() => navigate("/employeeLogin")}
              className="text-red-600 cursor-pointer hover:underline"
            >
              Employee Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}