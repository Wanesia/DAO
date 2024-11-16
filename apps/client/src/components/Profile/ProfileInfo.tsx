import styles from "./ProfileInfo.module.css";
export interface UserProfile {
  name: string;
  surname: string;
  profilePicture: string;
  createdAt: Date;
  lastSeen: Date;
}

interface ProfileInfoProps {
  user: UserProfile;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const { name, surname, profilePicture, createdAt, lastSeen } = user;
  
  // Function to calculate time ago
  const timeAgo = (lastSeen: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(lastSeen).getTime();
    
    const minutes = Math.floor(diff / (1000 * 60)); // Difference in minutes
    const hours = Math.floor(diff / (1000 * 60 * 60)); // in hours
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)); //in days

    // If less than 10 minutes ago
    if (minutes < 10) {
      return (
        <span>
          <span style={{ color: "green" }}>●</span> now
        </span>
      );
    }

    // If less than 1 hour ago
    if (hours < 1) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }

    // If within today
    if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    // If more than 24 hours ago, display "X days ago"
    if (days < 2) {
      return "Yesterday";
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.profileInfo}>
        <img
          src={profilePicture || "/profile1.jpg"}
          alt={`${name}'s profile`}
          className={styles.picture}
        />
        <div>
          <h1>
            {name} {surname}
          </h1>
          <p>
            Medlem siden{" "}
            {new Date(createdAt).toLocaleDateString("da-DK", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>Sidst logget ind {timeAgo(lastSeen)}</p>
        </div>
      </div>
      <div className={styles.buttons}>
        <button className={styles.btn}>Rediger profil</button>
        <button className={styles.btn}>Indstilinger</button>
      </div>
    </div>
  );
}
export default ProfileInfo;
