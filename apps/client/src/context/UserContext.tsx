import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {UserProfile} from "@shared/userProfile";
import {useAuth} from "./AuthContext";

interface UserContextValue {
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No token found");
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get<UserProfile>("/users/profile");
      const userData = response.data;

      const transformedUser = {
        ...userData,
        createdAt: new Date(userData.createdAt),
        lastSeen: new Date(userData.lastSeen),
      };

      setUser(transformedUser);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [isLoggedIn]);

  const refreshUser = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<UserProfile>("/users/profile");
      const userData = response.data;
      
      const transformedUser = {
        ...userData,
        createdAt: new Date(userData.createdAt),
        lastSeen: new Date(userData.lastSeen),
        updatedAt: new Date(),
        
      };
      
      setUser(transformedUser); 
      console.log("User data refreshed", transformedUser);
      
    } catch (error) {
      console.error("Error refreshing user data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
