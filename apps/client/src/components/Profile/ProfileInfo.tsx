import { useNavigate } from "@tanstack/react-router";
import styles from "./ProfileInfo.module.css";
import Button from "../Button/Button";
import { deleteInstrument } from "../../api/userApi";
import { useState } from "react";
import { FaCircle, FaTrash } from "react-icons/fa";
import EnsembleList from "./EnsembleList";
import PostList from "./PostList";
import { useNotification } from "../../context/NotificationContext";
import { useUser } from "../../context/UserContext";
import { useEffect } from "react";

const ProfileInfo: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser, user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const { addNotification } = useNotification();

  const handleDelete = async (index: number) => {
    if (isDeleting) return;
    if (!user?.email) {
      addNotification("error", "Bruger e-mail mangler. Prøv igen.");
      return;
    }

    try {
      setIsDeleting(true);
      await deleteInstrument(user.email, index);
      await refreshUser();
      addNotification("success", "Instrument slettet");
    } catch (error) {
      addNotification("error", "Kunne ikke slette instrument");
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
      return "Online";
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

  useEffect(() => {
    console.log("ProfileInfo detected user context update:", user);
  }, [user]);
  
  

  if (!user) {
    return null;
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
            {getUserStatus(user.lastSeen) === "Online" ? (
              <>
                <FaCircle className={styles.online} />
                Online
              </>
            ) : (
              `Sidst logget ind ${getUserStatus(user.lastSeen)}`
            )}
          </p>
        </div>
      </div>
      <div className={styles.buttons}>
        <Button
          text="Rediger profil"
          color="white-slim"
          onClick={() => navigate({ to: "/update-profile" })}
        />
        <Button 
          text="Indstilinger"
          color="white-slim"
          onClick={() => navigate({ to: "/settings" })}
        />
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
        {user.instruments && user.instruments.length > 0 ? (
          user.instruments.map((instrument, index) => (
            <div key={`instrument-${index}`} className={styles.content}>
              <div className={styles.instrument}>
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
          <Button 
            text="Opret" 
            color="white-slim"  
            onClick={() => navigate({ to: "/ensembles/create-ensemble" })}
          />
        </div>
        <EnsembleList />
      </div>
      <div className={`${styles.container} ${styles["ensembler-container"]}`}>
        <div className={styles.ensembleHeading}>
          <h2>Mine opslag</h2>
          <Button 
            text="Opret" 
            color="white-slim"  
            onClick={() => navigate({ to: "/posts/create-post" })}
          />
        </div>
        <PostList />
      </div>
    </div>
  );
};

export default ProfileInfo;