import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import UserProvider from "./Context/UserProvider";
import { UserAdminProvider } from "./Context/UserAdminProvider";
import { Toaster } from "react-hot-toast";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <UserAdminProvider>
              <App />
            
              <Toaster position="top-right" reverseOrder={false} />
            </UserAdminProvider>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </NextUIProvider>
  </React.StrictMode>
);
