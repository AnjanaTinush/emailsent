import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux"; // Import useSelector to access Redux state

import UserLogin from "./pages/UserLogin.jsx";
import Header from "./component/Header.jsx";
import PrivateRoute from "./component/PrivateRoute.jsx";
import UserRegister from "./pages/UserRegister.jsx";
import Profile from "./pages/Profile.jsx";
import EmployeeLogin from "./pages/EmployeeLogin.jsx";
import EmployeeDashboard from "./pages/employeeManagement/EmployeeDashboard.jsx"; // Example employee page
import Home from "./pages/Home.jsx"; // Import the Home component
import ViewUser from "./pages/user management/ViewUser.jsx";
import ViewUserDetail from "./pages/user management/ViewUserDetail.jsx";
import AddProduct from "./pages/product management/AddProduct.jsx";
import ViewProducts from "./pages/product management/viewProduct.jsx";
import EditProduct from "./pages/product management/EditProduct.jsx";
import CartPage from "./pages/cart management/CartPage.jsx";
import CheckoutPage from "./pages/payment management/CheckoutPage.jsx";
import OrdersPage from "./pages/payment management/OrdersPage.jsx";
import ViewCheckouts from "./pages/payment management/ViewCheckouts.jsx";
import CheckoutDetails from "./pages/payment management/CheckoutDetails.jsx";
import ViewFeedback from "./pages/feedback management/ViewFeedback.jsx";
import ProductView from "./pages/ProductView.jsx";
import Footer from "./component/Footer.jsx";
import SummarySection from "./pages/payment management/SummarySection.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

// Separate component to access `useLocation` hook and Redux state
function AppContent() {
  const location = useLocation();

  // Access Redux state for user and employee authentication
  const { currentUser } = useSelector((state) => state.user); // Get user state
  const { currentEmployee } = useSelector((state) => state.employee); // Get employee state

  // Define routes where the header should not be shown
  const hideHeaderRoutes = [
    "/employeeLogin",
    "/employeeDashboard",
    "/viewuser",
    "/viewuserdetails/:id", // Dynamic route
    "/addproduct",
    "/viewproducts",
    "/editproduct/:id", // Dynamic route
    "/viewcheckouts",
    "/checkoutdetails/:checkoutId", // Dynamic route
    "/viewfeedback",
  ];

  // Define routes where the footer should not be shown
  const hideFooterRoutes = [
    "/employeeLogin",
    "/employeeDashboard",
    "/viewuser",
    "/viewuserdetails/:id", // Dynamic route
    "/addproduct",
    "/viewproducts",
    "/editproduct/:id", // Dynamic route
    "/viewcheckouts",
    "/checkoutdetails/:checkoutId", // Dynamic route
    "/viewfeedback",
  ];

  // Function to check if the current route should hide the header
  const shouldHideHeader = () => {
    return hideHeaderRoutes.some((route) => {
      const routePattern = new RegExp(`^${route.replace(/:\w+/g, "\\w+")}$`);
      return routePattern.test(location.pathname);
    });
  };

  // Function to check if the current route should hide the footer
  const shouldHideFooter = () => {
    return hideFooterRoutes.some((route) => {
      const routePattern = new RegExp(`^${route.replace(/:\w+/g, "\\w+")}$`);
      return routePattern.test(location.pathname);
    });
  };

  // Check if the current route is in the hideHeaderRoutes array
  const shouldShowHeader = !shouldHideHeader();

  // Check if the current route is in the hideFooterRoutes array
  const shouldShowFooter = !shouldHideFooter();

  return (
    <>
      {/* Conditionally render the Header */}
      {shouldShowHeader && <Header isLoggedIn={!!currentUser} handleLogout={() => {}} />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/employeeLogin" element={<EmployeeLogin />} />
        <Route path="/product/:productId" element={<ProductView />} />

        {/* Protected routes for employees */}
        <Route element={<PrivateRoute isLoggedIn={!!currentEmployee} />}>
          <Route path="/employeeDashboard" element={<EmployeeDashboard />} />
          <Route path="/viewuser" element={<ViewUser />} />
          <Route path="/viewuserdetails/:id" element={<ViewUserDetail />} />

          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/viewproducts" element={<ViewProducts />} />
          <Route path="/editproduct/:id" element={<EditProduct />} />

          <Route path="/viewcheckouts" element={<ViewCheckouts />} />
          <Route path="/checkoutdetails/:checkoutId" element={<CheckoutDetails />} />

          <Route path="/viewfeedback" element={<ViewFeedback />} />
          <Route path="/checkoutsummary" element={<SummarySection />} />
        </Route>

        {/* Protected routes for users */}
        <Route element={<PrivateRoute isLoggedIn={!!currentUser} />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/cartpage/:id" element={<CartPage />} />
          <Route path="/checkout/:id" element={<CheckoutPage />} />
          <Route path="/orderspage/:id" element={<OrdersPage />} />
        </Route>
      </Routes>

      {/* Conditionally render the Footer */}
      {shouldShowFooter && <Footer />}
    </>
  );
}