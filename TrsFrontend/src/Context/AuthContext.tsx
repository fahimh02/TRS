//import React, { createContext, useState, useEffect, ReactNode } from "react";
import React, { createContext, useState, ReactNode, useContext } from "react";
import axios from "../api/axios";

interface AuthContextType {
  auth: { token: string | null; isLoggedIn: boolean };
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>;
  logout: () => void;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterUserData {
  username: string;
  password: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<{
    token: string | null;
    isLoggedIn: boolean;
  }>({
    token: null,
    isLoggedIn: false,

  });


  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);
      setAuth({ token: response.data.token, isLoggedIn: true });
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const register = async (userData: RegisterUserData) => {
    try {
      const response = await axios.post("/api/auth/register", userData);
      setAuth({ token: response.data.token, isLoggedIn: true });
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      throw error;
    }
  };

  const logout = () => {
    setAuth({ token: null, isLoggedIn: false });
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthContext, AuthProvider, useAuth };
