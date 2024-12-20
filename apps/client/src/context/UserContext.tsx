import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {UserProfile} from "@shared/userProfile";
import {useAuth} from "./AuthContext";

interface UserContextValue {
  user: UserProfile | null;
  loading: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
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

    if (isLoggedIn) {
      fetchUserData(); 
    } else {
      setUser(null); 
      setLoading(false);
    }
  }, [isLoggedIn]);

  return (
    <UserContext.Provider value={{ user, loading }}>
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
