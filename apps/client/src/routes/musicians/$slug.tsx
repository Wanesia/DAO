import { createFileRoute } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { getUserBySlug } from "../../api/userApi";
import styles from "./Musicians.module.css";
import Button from "../../components/Button/Button";
import GenreTags from "../../components/general-components/GenreTags";
import { getEnsemblesByCreator } from "../../api/ensembleApi";
import { useEffect, useState } from "react";
import { Ensemble } from "@shared/types";
import EnsembleCard from "../../components/EnsembleCard/EnsembleCard";
import { MdContactPhone } from "react-icons/md";

export const Route = createFileRoute("/musicians/$slug")({
  component: MusicianInfo,
  loader: async ({ params: { slug } }) => {
    return await getUserBySlug(slug);
  },
});

function MusicianInfo() {
  const { slug } = useParams({
    from: "/musicians/$slug",
    strict: true,
  });
  const user = Route.useLoaderData();
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [loading, setLoading] = useState<boolean | null>(false);
  const [error, setError] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);

  const handleContactClick = () => {
    setShowContactModal(true);
  };

  const closeModal = () => {
    setShowContactModal(false);
  };

  useEffect(() => {
    if (user?._id) {
      const fetchEnsembles = async () => {
        try {
          setLoading(true);
          setError(null);
          const ensemblesData = await getEnsemblesByCreator(user._id);
          setEnsembles(ensemblesData);
        } catch (err) {
          setError("Failed to load ensembles.");
        } finally {
          setLoading(false);
        }
      };

      fetchEnsembles();
    }
  }, [user]);

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

  if (!user) {
    return <div>{slug}</div>;
  }

  return (
    <main>
      <div className={styles.wrapper}>
        <div className={styles.heading}>
          <div className={styles.imageContainer}>
            {user.profilePicture && (
              <img
                src={user.profilePicture}
                alt={`${user.name} ${user.surname}`}
                className={styles.profilePicture}
              />
            )}
            <div>
              <div className={styles.name}>
                <h2>
                  {user.name} {user.surname}
                </h2>
                {user.isSeeking && <p className={styles.isSeeking}>SØGENDE</p>}
              </div>

               <p className={styles.status}>
                Medlem siden{" "}
                {new Date(user.createdAt).toLocaleDateString("da-DK", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className={styles.status}>
                {getUserStatus(user.lastSeen) === "Online"
                  ? "Online"
                  : `Sidst logget ind ${getUserStatus(user.lastSeen)}`}
              </p>
            </div>
          </div>

          <Button color="blue" text="Kontakt" onClick={handleContactClick} />
          {showContactModal && (
            <div className={styles.modalOverlay} onClick={closeModal}>
              <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
              >
                <MdContactPhone size={30} className={styles.icon} />
                <h3>Kontakt {user.name}</h3>
                <div className={styles.contactDetails}>
                  {user.phone && (
                    <Button
                      color="blue"
                      text={user.phone}
                      onClick={() =>
                        (window.location.href = `tel:${user.phone}`)
                      }
                    />
                  )}
                  <Button
                    color="blue"
                    text={user.email}
                    onClick={() =>
                      (window.location.href = `mailto:${user.email}`)
                    }
                  />
                </div>
                <Button text="Tilbage" onClick={closeModal} color="white" />
              </div>
            </div>
          )}
        </div>

        {user.profileText && (
          <div className={styles.profileText}>
            <h3 className={styles.subheading}>Profiltekst</h3>
            <p>{user.profileText}</p>
          </div>
        )}
        <div className={styles.section}>
          <h3 className={styles.subheading}>{user.name}s instrumenter</h3>
          <div className="gridLarge">
            {user.instruments && user.instruments.length > 0 ? (
              user.instruments.map((instrument, index) => (
                <div className={styles.content}>
                  <div
                    key={`instrument-${index}`}
                    className={styles.instrument}
                  >
                    <div className={styles.top}>
                      <p className={styles.text}>{instrument.name}</p>

                      <p>
                        Erfaring
                        <span className={styles.level}>{instrument.level}</span>
                      </p>
                    </div>

                    <GenreTags genres={instrument.genres} />
                  </div>
                </div>
              ))
            ) : (
              <p>Ingen instrumenter registreret</p>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.subheading}>{user.name}s ensembler</h3>
          {loading ? (
            <p>Loading ensembler...</p>
          ) : error ? (
            <p>{error}</p>
          ) : ensembles.length > 0 ? (
            <div className="gridLarge">
              {ensembles.map((ensemble) => (
                <EnsembleCard ensemble={ensemble} key={ensemble._id} />
              ))}
            </div>
          ) : (
            <p>Ingen ensembler</p>
          )}
        </div>
      </div>
    </main>
  );
}
