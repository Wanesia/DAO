import { useNavigate } from "@tanstack/react-router";
import Button from "../Button/Button";
import { UserProfile } from "@shared/userProfile.ts";
import FormInput from "../form-components/FormInput";
import { useForm, FieldValues } from "react-hook-form";
import styles from "./ProfileSettings.module.css";
import { Grid } from "@mantine/core";
import DragAndDrop from "../DragAndDrop/DragAndDrop";
import FormTextarea from "../form-components/Textarea";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import axios from "axios";

interface ProfileInfoProps {
  user: UserProfile;
}
const ProfileSettings: React.FC<ProfileInfoProps> = ({ user }) => {
  const navigate = useNavigate();
  const { control, handleSubmit, setValue } = useForm<FieldValues>({
    defaultValues: {
      name: user.name || "",
      surname: user.surname || "",
      email: user.email || "",
      phone: user.phone || "",
      postcode: user.location?.postCode || "",
      city: user.location?.city || "",
      profileText: user.profileText || "",
      isSeeking: user.isSeeking || false,
    },
  });
  const [isSeeking, setIsSeeking] = useState(user.isSeeking ?? false);

  // Update form when isSeeking changes
  useEffect(() => {
    setValue('isSeeking', isSeeking);
  }, [isSeeking, setValue]);
  
  const onSubmit = async (data: FieldValues) => {
    try {
      const updateData = {
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        location: {
          postCode: data.postcode,
          city: data.city
        },
        profileText: data.profileText,
        isSeeking: data.isSeeking
      };

      await axiosInstance.patch(`/users/${user.email}`, updateData);
      navigate({ to: "/profile" });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Profile update failed', error.response?.data);
      } else {
        console.error('An unexpected error occurred', error);
      }
    }
  };

  return (
    <>
      <Button
        type="button"
        color="white"
        text="Tilbage"
        onClick={() => navigate({ to: "/profile" })}
      />
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormInput name="name" control={control} label="Navn"></FormInput>
        <FormInput
          name="surname"
          control={control}
          label="Efternavn"
        ></FormInput>
        <DragAndDrop
          name="image"
          control={control}
          size="large"
          placeholderImage="/placeholder1.png"
          buttonLabel="Upload Cover Image"
        />
        <FormTextarea
          name="profileText"
          control={control}
          label="Profilbeskrivelse"
          placeholder="Skriv eventuelt kort om din musikalske erfaring eller hvad du søger..."
          rows={8}
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

        <div className={styles.div}>
          <p className={styles.title}>Kontaktoplysninger</p>
          <p className={styles.info}>
            Din mail-adresse og mobilnummer er kun synligt for andre hvis du på
            din profil har markeret, at du søger nogle at spille med eller hvis
            du har et aktivt opslag.
          </p>
          <FormInput
            name="email"
            type="email"
            control={control}
            placeholder="E-mail"
            aria-describedby="contact-info"
          />
          <FormInput
            name="phone"
            type="phone"
            control={control}
            placeholder="Mobilnummer"
            aria-describedby="contact-info"
          />
        </div>
        <div className={styles.div}>
          <p className={styles.title}>Profilstatus</p>
          <p className={styles.info}>
            Søger du i øjeblikket nogle at spille med? Hvis du vælger 'søger
            ikke' vil din profil ikke dukke op når andre musikere laver en
            søgning.
          </p>
          <div className={styles.status}>
            <Button
              type="button"
              onClick={() => setIsSeeking(true)}
              text="Søger"
              color={isSeeking ? "blue" : "white"}
            />

            <Button
              type="button"
              onClick={() => setIsSeeking(false)}
              text="Søger ikke"
              color={!isSeeking ? "blue" : "white"}
            />
          </div>
        </div>

        <Button color="blue" text="Gem profil" type="submit" />
      </form>
    </>
  );
};

export default ProfileSettings;
