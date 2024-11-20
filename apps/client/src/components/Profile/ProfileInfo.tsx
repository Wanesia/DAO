import styles from "./ProfileInfo.module.css";
import {UserProfile} from "@shared/userProfile.ts";

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
      <div className={styles['description-container']}>
            <h2>Profiltekst</h2>
            <p>{user.profileText}</p>
      </div>
      <div className={styles['instrument-container']}>
            <h2>Mine instrumenter</h2>
            <p>{}</p>
      </div>
    </div>
  );
};
export default ProfileInfo;
