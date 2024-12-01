import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "react-toastify/dist/ReactToastify.css";
import router from "./Router/router.jsx";
import { RouterProvider } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={2000}
      newestOnTop={false}
      rtl={false}
      pauseOnHover={false}
      theme="light"
      transition={Bounce}
    />
    <RouterProvider router={router} />
  </StrictMode>
);
