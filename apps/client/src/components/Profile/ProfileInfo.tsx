import { useNavigate } from "@tanstack/react-router";
import styles from "./ProfileInfo.module.css";
import { UserProfile } from "@shared/userProfile.ts";
import Button from "../Button/Button";

interface ProfileInfoProps {
  user: UserProfile;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const navigate = useNavigate();
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
            Medlem siden{" "}
            {user.createdAt.toLocaleDateString("da-DK", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>
            Sidst logget ind{" "}
            {user.lastSeen.toLocaleDateString("da-DK", {
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
        {user.instruments && user.instruments.length > 0 ? (
          user.instruments.map((instrument, index) => (
            <div className={styles.content}>
              <div key={index} className={styles.instrument}>
                <div className={styles.top}>
                  <p className={styles.text}>{instrument.name}</p>
                  <p>
                    Erfaring{" "}
                    <span className={styles.level}>{instrument.level}</span>
                  </p>
                </div>
                <ul className={styles.genres}>
                  {instrument.genres.map((genre, i) => (
                    <li key={i}>{genre}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p>Ingen instrumenter registreret</p>
        )}
      </div>
      <div className={`${styles.container} ${styles["ensembler-container"]}`}>
        <h2>Mine ensembler</h2>
        {/* todo get ensembles info*/}
        <p>{"Ingen ensembler registreret"}</p>
      </div>
    </div>
  );
};
export default ProfileInfo;
