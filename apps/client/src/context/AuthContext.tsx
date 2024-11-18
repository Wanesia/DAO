import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { User, LoginPayload } from "@shared/types";
import { loginUser } from "../api/authApi";
import { getUserStatus } from "../api/userApi";

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getToken = () => localStorage.getItem("access_token");
const setToken = (token: string) => localStorage.setItem("access_token", token);
const removeToken = () => localStorage.removeItem("access_token");

// validating token
const isTokenValid = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return exp ? Date.now() < exp * 1000 : false;
  } catch {
    return false;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {

      const token = getToken();

      if (token && isTokenValid(token)) {
        try {
          // not done 
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const userData = await getUserStatus();
          setUser(userData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error fetching user status:", error);
          removeToken();
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        removeToken();
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (payload: LoginPayload) => {
    try {
      const { accessToken, user: loggedInUser } = await loginUser(payload);

      setToken(accessToken);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      console.log("Logged in user:", loggedInUser);
      setUser(loggedInUser);
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
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
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
