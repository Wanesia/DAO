import React, { useState, useEffect } from "react";
import EnsembleCard from "../EnsembleCard/EnsembleCard"; // Assuming you'll create this component
import styles from "./ProfileInfo.module.css"
import { getEnsemblesByIds } from "../../api/ensembleApi";

interface Ensemble {
  _id: string;
  name: string;
}

interface EnsembleListProps {
  ensembleIds: string[];
}

const EnsembleList: React.FC<EnsembleListProps> = ({ ensembleIds }) => {
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchEnsembles = async () => {
      try {
        setLoading(true);
        setError(null);
  
        if (ensembleIds.length > 0) {
          const fetchedEnsembles = await getEnsemblesByIds(ensembleIds);
          setEnsembles(fetchedEnsembles);
        } else {
          setEnsembles([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch ensembles", err);
        setError(err instanceof Error ? err.message : "Failed to load ensembles");
        setLoading(false);
      }
    };
  
    fetchEnsembles();
  }, [ensembleIds]);

  if (loading) return <div>Loading ensembles...</div>;
  if (error) return <div>Error: {error}</div>;
  if (ensembles.length === 0) return <p>Ingen ensembler registreret</p>;

  return (
    <div className={styles.ensembles}>
      {ensembles.map((ensemble) => {
        return <EnsembleCard key={ensemble._id} ensemble={ensemble} />;
      })}
    </div>
  );
};

export default EnsembleList;
