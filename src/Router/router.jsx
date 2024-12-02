import { createBrowserRouter } from "react-router";
import App from "../App";
import LoginPage from "../pages/LoginPage";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  // Home
  {
    path: "/",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
  },

  // Authentication routes
  {
    path: "/authentication",
    children: [
      {
        index: true, // Default route: "/authentication"
        element: <LoginPage />,
      },
      {
        path: "login", // "/authentication/login"
        element: <LoginPage />,
      },
      // Additional routes can be added here (e.g., signup)
    ],
  },
]);

export default router;
