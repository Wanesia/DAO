import React from "react";
import { useForm, FieldValues } from "react-hook-form";
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
import DragAndDrop from "../DragAndDrop/DragAndDrop";
import { MusicianCount, PracticeFrequency, EnsembleType, Genre } from "../../constants/enums";
import { useNotification } from "../../context/NotificationContext";

const EnsembleForm: React.FC = () => {
  const { control, handleSubmit, setError } = useForm<FieldValues>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { addNotification } = useNotification();

  const navigate = useNavigate();

  const practiceFrequencyOptions = Object.keys(PracticeFrequency).map(
    (key) => ({
      value: PracticeFrequency[key as keyof typeof PracticeFrequency],
      label: PracticeFrequency[key as keyof typeof PracticeFrequency],
    })
  );

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

  const onSubmit = async (data: FieldValues) => {
    setLoading(true);
    setErrorMessage("");
  
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("homepageUrl", data.homepage || "");
      formData.append("city", data.city || "");
      formData.append("postcode", data.postcode || "");
      formData.append("number_of_musicians", data.number_of_musicians);
      formData.append("practice_frequency", data.practiceFrequency);
      formData.append("genres", JSON.stringify(data.genres));
      formData.append("type", data.playType);
      formData.append("image", data.image);
  
      await createEnsemble(formData);
  
      addNotification("success", "Ensemble oprettet med succes!");
      navigate({ to: "/profile" });
    } catch (error: any) {
      
      const errorMessage = error?.data?.message || "Failed to create ensemble.";
      if (errorMessage === "Ensemble name must be unique") {
        setError("name", {
          type: "manual",
          message: "Et ensemble med dette navn findes allerede.",
        });
      } else {
        addNotification("error", "Der skete en fejl. Prøv igen.");
      }

    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <FormInput
        name="name"
        label="Ensemblets navn"
        control={control}
        placeholder="Ensemblets navn"
        required
      />
      <DragAndDrop
        name="image"
        control={control}
        size="large"
        placeholderImage="/placeholder1.png"
        buttonLabel="Upload coverbillede"
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
        type="url"
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
            required
            placeholder="Postnr."
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <FormInput name="city" control={control} placeholder="By" required/>
        </Grid.Col>
      </Grid>
      <SingleSelect
        name="number_of_musicians"
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
        required
        options={ensembleTypeOptions}
        label="Ensemblet spiller..."
      />
      <MultiSelect
        name="genres"
        control={control}
        options={genreOptions}
        label="Genrer"
        required
      />
      <Button
        color="blue"
        text={loading ? "Opretter..." : "Opret ensemble"}
        type="submit"
      />
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </form>
  );
};

export default EnsembleForm;
