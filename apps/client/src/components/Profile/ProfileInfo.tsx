import styles from "./ProfileInfo.module.css";
import { UserProfile } from "@shared/userProfile.ts";

interface ProfileInfoProps {
  user: UserProfile;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <img
          className={styles.picture}
          src={user.profilePicture ?? "/public/profile.png"}
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
        <button className="btn">Rediger profil</button>
        <button className="btn">Indstilinger</button>
      </div>
      <div className={`${styles.container} ${styles["text-container"]}`}>
        <h2 className={styles.title}>Profiltekst</h2>
        <p>{user.profileText ?? "Ingen profiltekst tilgængelig"}</p>
      </div>
      <div className={`${styles.container} ${styles["instrument-container"]}`}>
        <div className={styles.top}>
          <h2>Mine instrumenter</h2>
          <button>Tilføj</button>
        </div>
        <div className={styles.content}>
          {user.instrument ? (
            <>
              {" "}
              <div className={styles.top}>
                <p className={styles.text}>{user.instrument.name}</p>
                <p>
                  Erfaring{" "}
                  <span className={styles.level}>{user.instrument.level}</span>
                </p>
              </div>
              <ul className={styles.genres}>
                {user.instrument.genres.map((genre, index) => (
                  <li key={index}>{genre}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>Ingen instrumenter registreret</p>
          )}
        </div>
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
