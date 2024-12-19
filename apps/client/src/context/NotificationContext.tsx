import React, { createContext, useState, useContext, ReactNode } from "react";

interface Notification {
  id: number;
  type: "success" | "error";
  message: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (type: "success" | "error", message: string) => void;
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (type: "success" | "error", message: string) => {
    const id = Date.now(); 
    setNotifications((prev) => [...prev, { id, type, message }]);

    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
