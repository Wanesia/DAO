import { useNavigate } from "@tanstack/react-router";
import styles from "./ProfileInfo.module.css";
import { UserProfile } from "@shared/userProfile.ts";
import Button from "../Button/Button";
import { deleteInstrument } from "../../api/userApi";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import EnsembleList from "./EnsembleList";

interface ProfileInfoProps {
  user: UserProfile;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [instruments, setInstruments] = useState(user.instruments);

  const handleDelete = async (index: number) => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await deleteInstrument(user.email, index);

      // Update local state by removing the deleted instrument
      setInstruments((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting instrument:", error);
      alert(
        error instanceof Error ? error.message : "Failed to delete instrument"
      );
    } finally {
      setIsDeleting(false);
    }
  };
  function getUserStatus(lastSeen: string | Date): string {
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMs = now.getTime() - lastSeenDate.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
  
    if (diffInSeconds < 60) {
      return "Online"; // User is online if lastSeen is less than 1 minute ago
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minut${minutes > 1 ? "ter" : ""} siden`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} time${hours > 1 ? "r" : ""} siden`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} dag${days > 1 ? "e" : ""} siden`;
    }
  }
  

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <img
          className={styles.picture}
          src={user.profilePicture ?? "/profile.png"}
          alt={`${user.name}'s profile`}
        />
        <div className={styles.text}>
          <h1>
            {user.name} {user.surname}
          </h1>
          <p>
            Medlem siden
            {" " + user.createdAt.toLocaleDateString("da-DK", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>
            {getUserStatus(user.lastSeen) === "Online"
              ? "Online"
              : `Sidst logget ind ${getUserStatus(user.lastSeen)}`}          </p>
        </div>
      </div>
      <div className={styles.buttons}>
        <Button
          text="Rediger profil"
          color="white-slim"
          onClick={() => navigate({ to: "/update-profile" })}
        />
        <Button text="Indstilinger" color="white-slim" />
      </div>
      <div className={`${styles.container} ${styles["text-container"]}`}>
        <h2 className={styles.title}>Profiltekst</h2>
        <p>{user.profileText ?? "Ingen profiltekst tilgængelig"}</p>
      </div>
      <div className={`${styles.container} ${styles["instrument-container"]}`}>
        <div className={styles.top}>
          <h2>Mine instrumenter</h2>
          <Button
            text="Tilføj"
            color="white-slim"
            onClick={() => navigate({ to: "/add-instrument" })}
          />
        </div>
        {instruments && user.instruments.length > 0 ? (
          instruments.map((instrument, index) => (
            <div className={styles.content}>
              <div key={`instrument-${index}`} className={styles.instrument}>
                <div className={styles.top}>
                  <p className={styles.text}>{instrument.name}</p>

                  <p>
                    Erfaring
                    <span className={styles.level}>{instrument.level}</span>
                  </p>
                </div>
                <ul className={styles.genres}>
                  {instrument.genres.map((genre, i) => (
                    <li key={`genre-${index}-${i}`}>{genre}</li>
                  ))}
                </ul>
                <FaTrash
                  className={styles.delete}
                  onClick={() => handleDelete(index)}
                  title="Slet instrument"
                />
              </div>
            </div>
          ))
        ) : (
          <p>Ingen instrumenter registreret</p>
        )}
      </div>
      <div className={`${styles.container} ${styles["ensembler-container"]}`}>
        <div className={styles.ensembleHeading}>
        <h2>Mine ensembler</h2>
        <Button text="Opret" color="white-slim"  onClick={() => navigate({ to: "/ensembles/create-ensemble" })}/>
        </div>
      
          <EnsembleList />
      </div>
    </div>
  );
};
export default ProfileInfo;
