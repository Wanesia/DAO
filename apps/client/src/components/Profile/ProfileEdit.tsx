import { useNavigate } from "@tanstack/react-router";
import Button from "../Button/Button";
import FormInput from "../form-components/FormInput";
import { useForm, FieldValues } from "react-hook-form";
import styles from "./ProfileEdit.module.css";
import { Grid } from "@mantine/core";
import DragAndDrop from "../DragAndDrop/DragAndDrop";
import FormTextarea from "../form-components/Textarea";
import { useEffect, useState } from "react";
import { updateUserProfile } from "../../api/userApi";
import { useNotification } from "../../context/NotificationContext";
import { useUser } from "../../context/UserContext";
import LoadingRing from "../LoadingRing/LoadingRing";

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { refreshUser, user } = useUser();
  const { control, handleSubmit, setValue } = useForm<FieldValues>({
    defaultValues: {
      name: user?.name || "",
      surname: user?.surname || "",
      email: user?.email || "",
      phone: user?.phone || "",
      postcode: user?.location?.postCode || "",
      city: user?.location?.city || "",
      profileText: user?.profileText || "",
      isSeeking: user?.isSeeking || false,
    },
  });

  const [isSeeking, setIsSeeking] = useState(user?.isSeeking ?? false);
  const [isLoading, setIsLoading] = useState(false);

  // Update form when isSeeking changes
  useEffect(() => {
    setValue("isSeeking", isSeeking);
  }, [isSeeking, setValue]);

  const onSubmit = async (data: FieldValues) => {
    if (!user?.email) {
      addNotification("error", "User email is missing. Please try again.");
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("surname", data.surname);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("postcode", data.postcode);
      formData.append("city", data.city);
      formData.append("profileText", data.profileText);
      formData.append("isSeeking", data.isSeeking.toString());

      // Append the image if it exists
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      await updateUserProfile(user.email, formData);
      await refreshUser();
      addNotification("success", "Profil opdateret med succes!");
      navigate({ to: "/profile" });
    } catch (error) {
      addNotification("error", "Der opstod en fejl. Prøv venligst igen.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        color="white-slim"
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
          size="small"
          placeholderImage={user?.profilePicture ?? "/profile.png"}
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

        <Button
          color="blue"
          type="submit"
          text="Gem profil"
          disabled={isLoading}
          children={isLoading ? <LoadingRing size="small"/> : null}
        />
      </form>
    </>
  );
};

export default ProfileEdit;
