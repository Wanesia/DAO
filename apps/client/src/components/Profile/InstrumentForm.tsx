import { useNavigate } from "@tanstack/react-router";
import Button from "../Button/Button";
import styles from "./InstrumentForm.module.css";
import SingleSelect from "../form-components/SingleSelect";
import { FieldValues, useForm } from "react-hook-form";
import MultiSelect from "../form-components/MultiSelect";
import { UserProfile } from "@shared/userProfile";
import React, { useState } from "react";
import LevelSelector from "./LevelSelector";
import { addInstrument } from "../../api/userApi";

interface ProfileInfoProps {
  user: UserProfile;
}
enum Genre {
  BAROK = "Barok",
  FOLKEMUSIK = "Folkemusik",
  KAMMERMUSIK = "Kammermusik",
  ROMANTISK = "Romantisk",
  SENMODERNE = "Senmoderne",
  SENROMANTISK = "Senromantisk",
  SYMFONISK = "Symfonisk",
}

export enum InstrumentName {
  Violone = "Violone",
  Violin = "Violin",
  Viola = "Viola",
  Viol = "Viol",
  Vihuela = "Vihuela",
  Trumpet = "Trumpet",
  Theorbo = "Theorbo",
  SlideTrumpet = "Slide trumpet",
  Serpent = "Serpent",
  Sackbut = "Sackbut",
  NaturalTrumpet = "Natural trumpet",
  NaturalHorn = "Natural Horn",
}
const InstrumentForm: React.FC<ProfileInfoProps> = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: "onBlur", // to trigger validation on blur(when the input field loses focus.)
  });

  const genreOptions = Object.keys(Genre).map((key) => ({
    value: Genre[key as keyof typeof Genre],
    label: Genre[key as keyof typeof Genre],
  }));
  const instrumentOptions = Object.values(InstrumentName).map((instrument) => ({
    label: instrument,
    value: instrument,
  }));

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMessage(null);
    console.log("Submitting instrument:", data);
    try {
      if (
        !data.name ||
        !data.level ||
        !data.genres ||
        data.genres.length === 0
      ) {
        setErrorMessage("Venligst vælg instrument, niveau og genrer.");
        setLoading(false);
        return;
      }
      await addInstrument(user.email, data);
      console.log("Instrument added successfully");
      navigate({ to: "/profile" });
    } catch (error) {
      console.error("Error adding instrument:", error);
      setErrorMessage("Der opstod en fejl. Prøv venligst igen.");
      setLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <Button
        type="button"
        color="white-slim"
        text="Tilbage"
        onClick={() => navigate({ to: "/profile" })}
      />
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2>Tilføj instrument</h2>

        <SingleSelect
          name="name"
          control={control}
          options={instrumentOptions}
          required
        />
        {errors.name && <p className={styles.error}>Vælg et instrument</p>}

        <LevelSelector name="level" control={control} />
        {errors.level && <p className={styles.error}>Vælg niveau</p>}

        <MultiSelect
          name="genres"
          control={control}
          options={genreOptions}
          label="Genrer"
          required
        />

        <Button
          color="blue"
          text={loading ? "Opretter..." : "Tilføj instrument"}
          type="submit"
        />
        {errors.genres && <p className={styles.error}>Vælg mindst en genre</p>}

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      </form>
    </div>
  );
};
export default InstrumentForm;
