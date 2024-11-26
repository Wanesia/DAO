import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { LoginPayload } from "@shared/types";
import { loginUser } from "../api/authApi";

type AuthContextType = {
  isLoggedIn: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  isTokenValid: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getToken = () => localStorage.getItem("access_token");
const setToken = (token: string) => localStorage.setItem("access_token", token);
const removeToken = () => localStorage.removeItem("access_token");

const validateToken = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return exp ? Date.now() < exp * 1000 : false;
  } catch {
    return false;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getToken();
    const isValid = validateToken(token);

    if (isValid) {
      setIsLoggedIn(true);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      removeToken();
      setIsLoggedIn(false);
    }
  }, []);

  const login = async (payload: LoginPayload) => {
    try {
      const { accessToken } = await loginUser(payload);
      setToken(accessToken);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to login:", error);
      throw new Error("Failed to login");
    }
  };

  const logout = () => {
    try {
      removeToken();
      delete axiosInstance.defaults.headers.common["Authorization"];
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const isTokenValid = (): boolean => validateToken(getToken());

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isTokenValid }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export type { AuthContextType };
