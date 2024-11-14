export interface UserProfile {
    firstName: string;
  lastName: string;
  profilePicture: string;
  createdAt: Date;
  lastSeen: Date;
}

interface ProfileInfoProps {
  user: UserProfile;
}

// function to format "last seen" time
const timeAgo = (date: Date): string => {
  const secondsAgo = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(secondsAgo / interval.seconds);
    if (count >= 1)
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
  }
  return "just now";
};
const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  return (
    <div className="container">
      <div className="informations">
        { /*<img src={user.profilePicture} alt={`${user.firstName}'s profile`} /> */}
        <h1>
          {user.firstName} {user.lastName}
        </h1>
        <p>
          Medlem siden{" "}
          {user.createdAt.toLocaleDateString("da-DK", {
            month: "long",
            year: "numeric",
          })}
        </p>
        <p>Sidst logget ind {timeAgo(user.lastSeen)}</p>
      </div>
      <div className="buttons">
        <button className="btn">Rediger profil</button>
        <button className="btn">Indstilinger</button>
      </div>
    </div>
  );
};
export default ProfileInfo;
