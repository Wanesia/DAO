import React, { useEffect } from "react";
import Button from "../Button/Button";
import SingleSelect from "../form-components/SingleSelect";
import { Ensemble } from "@shared/types";
import { useState } from "react";
import { getEnsemblesByCreator } from "../../api/ensembleApi";
import { useWatch } from "react-hook-form";
import styles from "./SelectEnsemble.module.css";
import { useNotification } from "../../context/NotificationContext";

const SelectEnsemble: React.FC<{
  onNext: () => void;
  control: any;
  setValue: (name: string, value: any) => void;
}> = ({ onNext, control }) => {
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const { addNotification } = useNotification();

  const ensembleId = useWatch({
    control,
    name: "ensembleId",
  });

  useEffect(() => {
    const fetchEnsembles = async () => {
      try {
        const ensemblesData = await getEnsemblesByCreator();
        setEnsembles(ensemblesData);
      } catch (err) {
        addNotification("error", "Der opstod en fejl. Prøv venligst igen.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnsembles();
  }, []);

  const handleNext = () => {
    if (!ensembleId) {
      setSelectionError("Vælg venligst et ensemble før du fortsætter");
      return;
    }
    setSelectionError(null);
    onNext();
  };

  const ensembleOptions = ensembles.map((ensemble) => ({
    value: ensemble._id.toString(),
    label: ensemble.name,
  }));

  return (
    <div className={styles.container}>
      <p>
        Vælg det ensemble som opslaget skal oprettes på vegne af. Hvis du er ved
        at starte en ny ensemble kan du oprette den.
      </p>
      <SingleSelect
        name="ensembleId"
        control={control}
        label="Mine ensembler"
        options={ensembleOptions}
        required
        error={selectionError}
      />
      <Button
        color="blue"
        text="Videre"
        onClick={handleNext}
        disabled={!ensembleId}
      />
    </div>
  );
};

export default SelectEnsemble;
