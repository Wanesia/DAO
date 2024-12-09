import { useState } from "react";
import Button from "./Button";
import { useNavigate } from "@tanstack/react-router";
import styles from "./DeleteButton.module.css";
import { deleteUser } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

interface ProfileDeleteButtonProps {
  userId: string;
}

export default function ProfileDeleteButton({userId}: ProfileDeleteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleDelete = async () => {
    try {
      await deleteUser(userId);
      logout();
      navigate({ to: "/" });
    } catch (error) {
      console.error("Failed to delete profile:", error);
      alert("Kunne ikke slette profil. Prøv igen senere.");
    }
  };

  return (
    <div className={styles.main}>
      <Button
        type="button"
        color="white"
        text="Slet profil"
        onClick={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.title}>Bekræft sletning</h2>
            <p>Er du sikker på, at du vil slette din profil?</p>
            <div className={styles.modalActions}>
              <Button
                onClick={() => setIsModalOpen(false)}
                text={"Annuller"}
                color="white"
              ></Button>
              <Button
                onClick={handleDelete}
                text={"Bekræft"}
                color="blue"
              ></Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
