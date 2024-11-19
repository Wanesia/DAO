interface UserProfile {
  name: string;
  surname: string;
  profilePicture?: string | null;
  createdAt: Date;
  lastSeen: Date;
}

interface ProfileInfoProps {
  user: UserProfile;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  return (
    <div className="container">
      <div className="informations">
        {/*<img src={user.profilePicture} alt={`${user.firstName}'s profile`} /> */}
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
      <div className="buttons">
        <button className="btn">Rediger profil</button>
        <button className="btn">Indstilinger</button>
      </div>
    </div>
  );
};
export default ProfileInfo;
