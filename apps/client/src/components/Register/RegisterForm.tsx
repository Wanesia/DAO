import styles from "./RegisterForm.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { registerUser } from "../../api/authApi";
import { useNavigate } from "@tanstack/react-router";
import FormInput from "../form-components/FormInput";
import Button from "../Button/Button";

type FormFields = {
  name: string;
  surname: string;
  email: string;
  password: string;
  isSubscribedToNewsletter: boolean;
  acceptedTerms: boolean;
};

export default function RegisterForm() {
  const {
    handleSubmit,
    setError,
    control,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      isSubscribedToNewsletter: false,
    },
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const { acceptedTerms, ...submitData } = data;
      await registerUser(submitData);
      navigate({ to: "/login" });
    } catch (error: any) {
      if (
        error.response &&
        error.response.data.message === "E-mailen findes allerede"
      ) {
        setError("email", { message: "E-mailen findes allerede" });
      } else {
        setError("root", {
          message: "Der opstod en fejl under registreringen",
        });
      }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h1>Opret profil</h1>
        <FormInput
          name="name"
          control={control}
          label="Fornavn"
          required
          placeholder="Fornavn"
          rules={{
            required: "Fornavn er påkrævet",
            minLength: {
              value: 2,
              message: "Fornavn skal være mindst 2 tegn langt",
            },
          }}
        />
        <FormInput
          name="surname"
          control={control}
          label="Efternavn"
          placeholder="Efternavn"
          required
          rules={{
            required: "Efternavn er påkrævet",
            minLength: {
              value: 2,
              message: "Efternavn skal være mindst 2 tegn langt",
            },
          }}
        />
        <FormInput
          name="email"
          type="email"
          control={control}
          label="E-mail"
          required
          placeholder="E-mail"
          rules={{
            required: "E-mail er påkrævet",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Ugyldigt e-mailformat",
            },
          }}
        />
        <FormInput
          name="password"
          type="password"
          control={control}
          label="Adgangskode"
          required
          placeholder="Adgangskode"
          rules={{
            required: "Adgangskode er påkrævet",
            minLength: {
              value: 8,
              message: "Adgangskode skal være mindst 8 tegn lang",
            },
          }}
        />

        <div className={styles.checkboxes}>
          <label className={styles.terms}>
            <input
              type="checkbox"
              {...register("acceptedTerms", {
                required: "Du skal acceptere betingelserne",
              })}
            />
            Jeg accepterer betingelserne
          </label>
          {errors.acceptedTerms && (
            <div className={styles.error}>{errors.acceptedTerms.message}</div>
          )}
          <label className={styles.terms} htmlFor="isSubscribedToNewsletter">
            <input {...register("isSubscribedToNewsletter")} type="checkbox" />
            Tilmeld mig DAOS nyhedsbrev
          </label>
        </div>

        <Button
          type="submit"
          text={isSubmitting ? "Indlæser..." : "Opret profil"}
          color="blue"
          onClick={() => navigate({ to: "/login" })}
          disabled={isSubmitting}
        />
        {errors.root && (
          <div className={styles.error}>{errors.root.message}</div>
        )}
      </form>
    </div>
  );
}
