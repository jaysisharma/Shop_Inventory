// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ element }) => {
  // Check if the user is logged in (using localStorage in this example)
  const isLoggedIn = localStorage.getItem("authToken");

  // If the user is not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If the user is logged in, render the protected component
  return element;
};

export default PrivateRoute;
