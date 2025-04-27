import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  // Access the currentUser and currentEmployee from the Redux store
  const { currentUser } = useSelector((state) => state.user);
  const { currentEmployee } = useSelector((state) => state.employee);

  // Check if either currentUser or currentEmployee exists
  return currentUser || currentEmployee ? <Outlet /> : <Navigate to="/login" />;
}