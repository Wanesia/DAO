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
            {user.createdAt.toLocaleDateString("da-DK", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>
            Sidst logget ind
            {" " + user.lastSeen.toLocaleDateString("da-DK", {
              day: "numeric",
              month: "long",
            })}
          </p>
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
        <h2>Mine ensembler</h2>
        <EnsembleList ensembleIds={user.ensembleIds} />
        </div>
    </div>
  );
};
export default ProfileInfo;
