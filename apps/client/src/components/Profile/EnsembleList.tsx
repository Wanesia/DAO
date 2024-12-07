import React, { useState, useEffect } from "react";
import EnsembleCard from "../EnsembleCard/EnsembleCard";
import { getEnsemblesByCreator } from "../../api/ensembleApi";
import { useNavigate } from "@tanstack/react-router";
import { Ensemble } from "@shared/types";

const EnsembleList: React.FC = () => {
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnsembles = async () => {
      setLoading(true);
      setError(null);

      try {
        const ensemblesByCreator = await getEnsemblesByCreator();
        console.log("ensembles", ensemblesByCreator);
        setEnsembles(ensemblesByCreator);
      } catch (err) {
        console.error("Failed to fetch ensembles", err);
        setError(
          err instanceof Error ? err.message : "Failed to load ensembles"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEnsembles();
  }, []);

  if (loading) return <div>Loading ensembles...</div>;
  if (error) return <div>Error: {error}</div>;
  if (ensembles.length === 0) return <p>No ensembles found</p>;

  return (
      <ul className="gridLarge">
        {ensembles.map((ensemble) => (
          <div
            key={ensemble._id}
            onClick={() =>
              navigate({
                to: `/ensembles/${ensemble._id}`,
                state: { ensemble: ensemble as Ensemble },
              })
            }
          >
            <div className="gridItemLarge">
              <EnsembleCard ensemble={ensemble} />
            </div>
          </div>
        ))}
      </ul>
  );
};

export default EnsembleList;
