import React from "react";
import styles from "./LoginPopUp.module.css";
import Button from "../../components/Button/Button";
import { useNavigate } from "@tanstack/react-router";

interface LoginPopupProps {
  onClose: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({
  onClose,

}) => {

    const navigate = useNavigate();
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).classList.contains(styles.overlay)) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.popup}>
        <h2>Log ind for at finde musikere du kan spille med i hele Danmark</h2>
        <Button color="blue" text="Opret profil" onClick={() => navigate({to: "/register"})} />
        <div className={styles.separator}>
          <span>eller</span>
        </div>
        <Button color="white" text="Log ind" onClick={() => navigate({to: "/login"})} />
      </div>
    </div>
  );
};

export default LoginPopup;
