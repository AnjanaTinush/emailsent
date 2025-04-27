import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    mobile: currentUser.mobile,
    address: currentUser.address,
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    // Username validation (only letters, no numbers or special characters)
    if (!/^[A-Za-z]+$/.test(formData.username)) {
      errors.username = 'Username should contain only letters.';
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    // Mobile validation (exactly 10 digits)
    if (!/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = 'Mobile number should be exactly 10 digits.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Filter out non-letter characters for the username field
    if (id === 'username') {
      const filteredValue = value.replace(/[^A-Za-z]/g, ''); // Remove non-letter characters
      setFormData({ ...formData, [id]: filteredValue });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop if validation fails

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/users/user/${currentUser._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/users/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleViewOrders = () => navigate(`/orderspage/${currentUser._id}`);
  const handleViewCart = () => navigate(`/cartpage/${currentUser._id}`);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <input
            type="text"
            id="username"
            value={formData.username}
            placeholder="Username"
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:border-[#660708] w-full"
          />
          {formErrors.username && <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>}
        </div>
        <div>
          <input
            type="email"
            id="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:border-[#660708] w-full"
          />
          {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
        </div>
        <div>
          <input
            type="text"
            id="mobile"
            value={formData.mobile}
            placeholder="Mobile"
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:border-[#660708] w-full"
          />
          {formErrors.mobile && <p className="text-red-500 text-sm mt-1">{formErrors.mobile}</p>}
        </div>
        <div>
          <input
            type="text"
            id="address"
            value={formData.address}
            placeholder="Address"
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:border-[#660708] w-full"
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:border-[#660708] w-full"
          />
        </div>
        <button
          disabled={loading}
          className="bg-[#660708] text-white py-3 rounded-lg uppercase hover:bg-[#7f0a10] transition"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <button onClick={handleViewOrders} className="w-full bg-blue-600 text-white py-3 rounded-lg uppercase mt-5 hover:bg-blue-700 transition">
        View Orders
      </button>
      <button onClick={handleViewCart} className="w-full bg-green-600 text-white py-3 rounded-lg uppercase mt-5 hover:bg-green-700 transition">
        View Cart
      </button>
      <div className="flex justify-between mt-6">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      {error && <p className="text-red-700 mt-4">{error}</p>}
      {updateSuccess && <p className="text-green-700 mt-4">User updated successfully!</p>}
    </div>
  );
}