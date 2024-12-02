import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email"); // Assuming you store email

  // If no token or email, redirect to login
  if (!token || !email) {
    return <Navigate to="/authentication/login" replace />;
  }

  // If valid token and email, render the children (App component)
  return children;
};

export default PrivateRoute;
