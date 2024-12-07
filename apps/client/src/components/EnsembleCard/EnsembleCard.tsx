import GenreTags from "../general-components/GenreTags";
import styles from "./EnsembleCard.module.css";
import { Ensemble } from "@shared/types";

interface EnsembleCardProps {
  ensemble: Ensemble;
}

const EnsembleCard: React.FC<EnsembleCardProps> = ({ ensemble }) => {
  function truncateText(text: string | undefined, maxLength: number) {
    if (!text) return "No description available";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }
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
            <p className={styles.city}>{ensemble.location?.city}</p>
            <p>{ensemble.number_of_musicians}</p>
          </div>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <p>
          {truncateText(ensemble.description, 100) ||
            "No description available"}
        </p>
        <GenreTags genres={ensemble.genres} />
      </div>
    </div>
  );
};

export default EnsembleCard;
