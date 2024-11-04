import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "../../api/axios";

const ProtectedUnLoggedRoute = () => {
  const [isValidToken, setIsValidToken] = React.useState<boolean | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await axios.get("/api/token/validate");
          setIsValidToken(true);
        } catch (error) {
          setIsValidToken(false);
        }
      } else {
        setIsValidToken(false);
      }
    };

    validateToken();
  }, []);

  if (isValidToken === null) {
    return <></>;
  }

  if (isValidToken) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedUnLoggedRoute;
