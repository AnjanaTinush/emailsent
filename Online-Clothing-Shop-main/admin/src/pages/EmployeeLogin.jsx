import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  employeeLoginStart,
  employeeLoginSuccess,
  employeeLoginFailure,
} from "../redux/employee/employeeSlice"; // Import employee actions

export default function EmployeeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.employee); // Get loading state from Redux

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      dispatch(employeeLoginStart()); // Start loading

      // Send login request to the backend using fetch
      const response = await fetch("/api/employee/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Parse the response as JSON
      const data = await response.json();

      // If login is successful, navigate to the employee dashboard
      if (data.message === "Login successful") {
        // Save the token to localStorage (or sessionStorage)
        localStorage.setItem("token", data.token);

        // Update the employee login state in Redux
        dispatch(employeeLoginSuccess(data.employee));

        // Navigate to the employee dashboard
        navigate("/employeeDashboard");
      } else {
        // Handle errors from the backend
        dispatch(employeeLoginFailure(data.message || "Invalid email or password"));
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      // Handle network or other errors
      dispatch(employeeLoginFailure("An error occurred during login"));
      setError("An error occurred during login");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F3F4]">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-[#F5F3F4]">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-[#161A1D]">
          Employee Login
        </h2>
        {error && (
          <p className="text-[#660708] text-sm mb-4 text-center">{error}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#161A1D]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#161A1D]"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#660708] text-[#F5F3F4] py-3 px-6 rounded-lg hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}