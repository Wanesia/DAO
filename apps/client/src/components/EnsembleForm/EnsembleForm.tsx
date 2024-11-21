import React from "react";
import { useForm } from "react-hook-form";
import Button from "../Button/Button";
import FormInput from "../form-components/FormInput";
import FormTextarea from "../form-components/Textarea";
import SingleSelect from "../form-components/SingleSelect";
import MultiSelect from "../form-components/MultiSelect";
import FormRadioGroup from "../form-components/FormRadioGroup";
import { Grid } from "@mantine/core";
import styles from "./EnsembleForm.module.css";
import { createEnsemble } from "../../api/ensembleApi";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export enum MusicianCount {
  ONE_TO_FOUR = "1-4 musikere",
  FIVE_TO_NINE = "5-9 musikere",
  TEN_TO_TWENTY_FOUR = "10-24 musikere",
  TWENTY_FIVE_TO_FORTY_NINE = "25-49 musikere",
  FIFTY_PLUS = "Mere end 50 musikere",
}

export enum PracticeFrequency {
  MULTIPLE_TIMES_WEEK = "Flere gange om ugen",
  ONCE_A_WEEK = "1 gang om ugen",
  EVERY_OTHER_WEEK = "1 gang hver anden uge",
  ONCE_A_MONTH = "1 gang om måneden",
  EVERY_OTHER_MONTH = "1 gang hver anden måned eller",
}

export enum EnsembleType {
  CONTINUOUS = "Kontinuerligt",
  PROJECT_BASED = "Projektbaseret",
}

export enum Genre {
  BAROK = "Barok",
  FOLKEMUSIK = "Folkemusik",
  KAMMERMUSIK = "Kammermusik",
  ROMANTISK = "Romantisk",
  SENMODERNE = "Senmoderne",
  SENROMANTISK = "Senromantisk",
  SYMFONISK = "Symfonisk",
}

const EnsembleForm: React.FC = () => {
  const { control, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const practiceFrequencyOptions = Object.keys(PracticeFrequency).map((key) => ({
    value: PracticeFrequency[key as keyof typeof PracticeFrequency],
    label: PracticeFrequency[key as keyof typeof PracticeFrequency], 
  }));
  

  const musicianCountOptions = Object.keys(MusicianCount).map((key) => ({
    value: MusicianCount[key as keyof typeof MusicianCount], 
    label: MusicianCount[key as keyof typeof MusicianCount],
  }));
  
  
  const genreOptions = Object.keys(Genre).map((key) => ({
    value: Genre[key as keyof typeof Genre],
    label: Genre[key as keyof typeof Genre],
  }));
  
  const ensembleTypeOptions = Object.keys(EnsembleType).map((key) => ({
    value: EnsembleType[key as keyof typeof EnsembleType],
    label: EnsembleType[key as keyof typeof EnsembleType],
  }));
  

  const onSubmit = async (data: any) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const newEnsemble = {
      name: data.name,
      description: data.description,
      homepageUrl: data.homepage,
      location: {
        city: data.city,
        postCode: data.postcode,
      },
      number_of_musicians: data.musicianCount,
      practice_frequency: data.practiceFrequency,
      genres: data.genres,
      type: data.playType,
    };

    try {
      await createEnsemble(newEnsemble);
      setSuccessMessage("Ensemble created successfully!");
      navigate({ to: "/profile" });
      
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Failed to create ensemble."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <FormInput
        name="name"
        control={control}
        placeholder="Ensemblets navn"
        required
      />
      <FormTextarea
        name="description"
        control={control}
        label="Beskrivelse"
        placeholder="Beskrivelse"
        required
      />

      <FormInput
        name="homepage"
        control={control}
        label="Hjemmeside"
        placeholder="Hjemmeside"
      />

      <Grid align="end">
        <Grid.Col span={6}>
          <FormInput
            name="postcode"
            control={control}
            label="Område"
            placeholder="Postnr."
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <FormInput name="city" control={control} placeholder="By" />
        </Grid.Col>
      </Grid>
      <SingleSelect
        name="musicianCount"
        control={control}
        options={musicianCountOptions}
        label="Antal aktive musikere"
        required
      />
      <SingleSelect
        name="practiceFrequency"
        control={control}
        options={practiceFrequencyOptions}
        label="Øvefrekvens"
        required
      />
      <FormRadioGroup
        name="playType"
        control={control}
        options={ensembleTypeOptions}
        label="Ensemblet spiller..."
      />
      <MultiSelect
        name="genres"
        control={control}
        options={genreOptions}
        label="Genrer"
      />
      <Button
        color="blue"
        text={loading ? "Opretter..." : "Opret ensemble"}
        type="submit"
      />
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </form>
  );
};

export default EnsembleForm;
