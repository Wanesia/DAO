import { UserProfile } from "@shared/userProfile";
import styles from "./UserCard.module.css";
import Button from "../Button/Button";
import { Instrument } from "@shared/types";
import GenreTags from "../general-components/GenreTags";

interface UserCardProps {
  user: UserProfile;
  size: "small" | "large";
}

const UserCard: React.FC<UserCardProps> = ({ user, size }) => {
  const renderProfilePicture = () => (
    <div className={styles.image}>
      <img
        src={user.profilePicture ?? "/profile.png"}
        alt={`${user.name}'s profile`}
      />
    </div>
  );

  const renderNameAndLocation = () => (
    <div className={styles.heading}>
      <h4 className={styles.title}>
        {user.name} {user.surname[0]}.
      </h4>
      <div className={styles.info}>
        <p className={styles.city}>{user.location?.city}</p>
      </div>
    </div>
  );

  const renderInstruments = () =>
    user.instruments && user.instruments.length > 0 ? (
      <div className={styles.instrumentContainer}>
        {user.instruments.slice(0, 2).map((instrument, index) => (
          <InstrumentCard key={`instrument-${index}`} instrument={instrument} />
        ))}
        {user.instruments.length > 2 && (
          <p className={styles.instrumentName}>
            + {user.instruments.length - 2} instrumenter mere
          </p>
        )}
      </div>
    ) : (
      <p className={styles.instrumentName}>Ingen instrumenter tilføjet</p>
    );

  return (
    <div className={styles.userCard}>
      <div className={styles[size]}>
        <div className={styles.headingContainer}>
          <div className={styles.imageName}>
            {renderProfilePicture()}
            {renderNameAndLocation()}
          </div>
          {size === "large" && <Button text="Vis profil" color="extra-small" />}
        </div>
        {size === "large" && renderInstruments()}
      </div>
    </div>
  );
};

export default UserCard;

function InstrumentCard({ instrument }: { instrument: Instrument }) {
  return (
    <div className={styles.instrumentCard}>
      <div className={styles.instrumentInfo}>
        <p className={styles.instrumentName}>{instrument.name}</p>
        <p className={styles.instrumentLevel}>
          Erfaring <span>{instrument.level}</span>
        </p>
      </div>
      <GenreTags genres={instrument.genres} />
    </div>
  );
}
