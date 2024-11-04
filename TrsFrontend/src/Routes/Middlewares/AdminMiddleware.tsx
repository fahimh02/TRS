/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "../../api/axios";
import { UserContext, UserContextType } from "../../Context/UserProvider";
import { CircularProgress } from "@nextui-org/react";

const AdminMiddleware = () => {
  const [isValidAdmin, setIsValidAdmin] = React.useState<boolean | null>(null);

  const {setUser }: UserContextType = useContext(UserContext);

  useEffect(() => {
    const checkAdminRole = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userinfo = await axios.get("/api/Users/current");
          setUser(userinfo.data);

          if (userinfo.data.role === "admin") {
            setIsValidAdmin(true);
          } else {
            setIsValidAdmin(false);
          }
        } catch (error) {
          setIsValidAdmin(false);
          localStorage.removeItem("token");
        }
      } else {
        setIsValidAdmin(false);
      }
    };

    checkAdminRole();
  }, []);

  if (isValidAdmin === null) {
    return <CircularProgress size="lg" aria-label="Loading..." />;
  }

  if (!isValidAdmin) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default AdminMiddleware;
