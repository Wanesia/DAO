import React from "react";
import { useForm } from "react-hook-form";
import Button from "../Button/Button";
import FormInput from "../form-components/FormInput/FormInput";
import FormTextarea from "../form-components/Textarea/Textarea";
import SingleSelect from "../form-components/SingleSelect/SingleSelect";
import MultiSelect from "../form-components/MultiSelect/MultiSelect";
import FormRadioGroup from "../form-components/FormRadioGroup/FormRadioGroup";
import { Grid } from "@mantine/core";
import styles from "./EnsembleForm.module.css";

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

interface EnsembleFormProps {
  onSubmit: (data: any) => void;
}

const EnsembleForm: React.FC<EnsembleFormProps> = ({ onSubmit }) => {
  const { control, handleSubmit } = useForm({});

  const practiceFrequencyOptions = Object.entries(PracticeFrequency).map(
    ([key, value]) => ({
      value: key,
      label: value,
    })
  );

  const musicianCountOptions = Object.entries(MusicianCount).map(
    ([key, value]) => ({
      value: key,
      label: value,
    })
  );

  const genreOptions = Object.entries(Genre).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  const ensembleTypeOptions = Object.entries(EnsembleType).map(
    ([key, value]) => ({
      value: key,
      label: value,
    })
  );

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
      <Button color="blue" text="Opret ensemble" type="submit" />
    </form>
  );
};

export default EnsembleForm;
