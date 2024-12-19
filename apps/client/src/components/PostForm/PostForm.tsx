import React, { useState } from "react";
import Button from "../Button/Button";
import FormInput from "../form-components/FormInput";
import FormTextarea from "../form-components/Textarea";
import MultiSelect from "../form-components/MultiSelect";
import { Grid } from "@mantine/core";
import { Genre, InstrumentName } from "../../constants/enums";
import SingleSelect from "../form-components/SingleSelect";
import LevelSelector from "../Profile/LevelSelector";
import styles from "./PostForm.module.css";

interface PostFormProps {
  control: any;
  handleSubmit: (e: React.FormEvent) => void;
}

const PostForm: React.FC<PostFormProps> = ({ control, handleSubmit }) => {
  const genreOptions = Object.keys(Genre).map((key) => ({
    value: Genre[key as keyof typeof Genre],
    label: Genre[key as keyof typeof Genre],
  }));

  const instrumentOptions = Object.values(InstrumentName).map((instrument) => ({
    label: instrument,
    value: instrument,
  }));

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <FormInput
          name="title"
          label="Titel"
          control={control}
          placeholder="Opslag titel"
          required
          rules={{ required: "Titel er påkrævet" }}
        />
        <FormTextarea
          name="description"
          control={control}
          label="Beskrivelse"
          required
          placeholder="Skriv en kort beskrivelse af hvad du søger…"
        />
        <SingleSelect
          name="name"
          label="Instrument"
          control={control}
          required
          options={instrumentOptions}
        />
        <LevelSelector
          name="level"
          control={control}
        />
        <Grid align="end">
          <Grid.Col span={6}>
            <FormInput
              name="postcode"
              control={control}
              label="Område"
              required
              placeholder="Postnr."
              rules={{ required: "Postnr. er påkrævet" }}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <FormInput
              name="city"
              required
              control={control}
              placeholder="By"
              rules={{ required: "By er påkrævet" }}
            />
          </Grid.Col>
        </Grid>
        <MultiSelect
          name="genres"
          control={control}
          required
          options={genreOptions}
          label="Genrer"
        />
        <Button
          color="blue"
          text="Opret opslag"
          type="submit"
        />
      </form>
    </div>
  );
};

export default PostForm;

