import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaBell, FaCog, FaUser, FaSignOutAlt } from "react-icons/fa"; // Using react-icons for better icons
import login from "../images/log-in.png"; // Login icon
import profilePic from "../images/user.png"; // Example profile picture
import { signOutUserStart, deleteUserFailure, deleteUserSuccess } from "../redux/user/userSlice";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/users/signout", { method: "GET" });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <header className="bg-[#161A1D] text-[#F5F3F4] shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Shop Name */}
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-[#660708] transition-colors">
            TrendByte
          </Link>
        </div>

        {/* Right-side icons */}
        <div className="flex space-x-6 items-center">
          {/* Icons for notifications and settings */}
          <button className="text-[#F5F3F4] hover:text-[#660708] transition-colors">
            <FaBell size={20} /> {/* Notification icon */}
          </button>

          <button className="text-[#F5F3F4] hover:text-[#660708] transition-colors">
            <FaCog size={20} /> {/* Settings icon */}
          </button>

          {/* Conditionally render Login or Profile based on login status */}
          {currentUser ? (
            <div className="relative">
              {/* Profile picture with dropdown */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 overflow-hidden rounded-full focus:outline-none border-2 border-[#660708] hover:border-[#F5F3F4] transition-colors"
              >
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#F5F3F4] text-[#161A1D] shadow-lg rounded-lg z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-[#660708] hover:text-[#F5F3F4] transition-colors"
                  >
                    <FaUser className="inline-block mr-2" /> Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 hover:bg-[#660708] hover:text-[#F5F3F4] transition-colors"
                  >
                    <FaCog className="inline-block mr-2" /> Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 hover:bg-[#660708] hover:text-[#F5F3F4] transition-colors"
                  >
                    <FaSignOutAlt className="inline-block mr-2" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <div className="w-10 h-10 overflow-hidden rounded-full hover:opacity-80 transition-opacity">
                <img
                  src={login}
                  alt="Login"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}