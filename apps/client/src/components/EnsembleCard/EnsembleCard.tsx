import JoinButton from "../Button/JoinButton";
import styles from "./EnsembleCard.module.css";
import { Ensemble } from "@shared/types";

interface EnsembleCardProps {
  ensemble: Ensemble;
}

const EnsembleCard: React.FC<EnsembleCardProps> = ({ ensemble }) => {
  return (
    <div className={styles.ensembleCard}>
      <div className={styles.headingContainer}>
        {ensemble.imageUrl && (
          <div className={styles.image}>
            <img src={ensemble.imageUrl} alt="ensemble-image" loading="lazy" />
          </div>
        )}
        <div className={styles.heading}>
          <h4 className={styles.title}>{ensemble.name}</h4>
          <div className={styles.info}>
            <p className={styles.city}>{ensemble.location.city}</p>
            <p>{ensemble.number_of_musicians}</p>
          </div>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <p>{ensemble.description || "No description available"}</p>
        <div className={styles.genres}>
          {ensemble.genres.map((genre) => (
            <span key={genre} className={styles.genre}>
              {genre}
            </span>
          ))}
        </div>
        <JoinButton ensembleId={ensemble._id}/>
        </div>
    </div>
  );
};

export default EnsembleCard;
