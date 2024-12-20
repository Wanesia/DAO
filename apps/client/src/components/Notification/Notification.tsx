import React from "react";
import styles from "./Notification.module.css"; 
import { useNotification } from "../../context/NotificationContext";

const Notification: React.FC = () => {
  const { notifications, removeNotification } = useNotification();
  return (
    <div className={styles.container}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles.notification} ${styles[notification.type]}`}
          onClick={() => removeNotification(notification.id)} 
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
};

export default Notification;
