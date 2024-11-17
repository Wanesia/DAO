import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { User } from "@shared/types";
import { loginUser } from "../api/authApi";
import { getUserStatus } from "../api/userApi";

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const user = await getUserStatus();
          setUser(user);
          setIsLoggedIn(true);
        } catch (error) {
          localStorage.removeItem("access_token");
          setIsLoggedIn(false);
        }
      }
    };

    fetchUser();
  }, []);
  const login = async (email: string, password: string) => {
    try {
      const { accessToken } = await loginUser(email, password);

      localStorage.setItem("access_token", accessToken);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        // need to get the actual user and set it here
      const user = await getUserStatus();
      console.log("user", user);
      setUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      throw new Error("Failed to login");
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("access_token");
      delete axiosInstance.defaults.headers.common["Authorization"];
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error during logout", error);
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
