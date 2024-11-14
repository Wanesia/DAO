import styles from "./RegisterForm.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

type FormFields = {
  name: string;
  surname: string;
  email: string;
  password: string;
  isSubscribedToNewsletter: boolean;
};

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        data
      );
      console.log("Registered successfully:", response.data);
    } catch (error) {
      setError("root", { message: "error during registering user" });
    }
  };
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h1>Opret profil</h1>
        <label htmlFor="name">Fornavn</label>
        <input
          {...register("name",  {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })} type="text"
          placeholder="Fornavn"
        ></input>
        {errors.name && (
          <div className={styles.error}>{errors.name.message}</div>
        )}
        <label htmlFor="surname">Efternavn</label>
        <input
          {...register("surname", {
            required: "Surname is required",
            minLength: {
              value: 2,
              message: "Surname must be at least 2 characters",
            },
          })} type="text"
          placeholder="Efternavn"
        ></input>
        {errors.surname && (
          <div className={styles.error}>{errors.surname.message}</div>
        )}
        <label htmlFor="email">E-mail</label>
        <input
          {...register("email", {
            required: "Email is required",
            validate: (value) => {
              if (!value.includes("@")) {
                return "Email must include @";
              }
              return true;
            },
          })}
          type="text"
          placeholder="E-mail"
        />
        {errors.email && (
          <div className={styles.error}>{errors.email.message}</div>
        )}
        <label htmlFor="password">Adgangskode</label>
        <input
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          type="password"
          placeholder="Adgangskode"
        />
        {errors.password && (
          <div className={styles.error}>{errors.password.message}</div>
        )}
        <button className={styles.btn} disabled={isSubmitting} type="submit">
          {isSubmitting ? "Loading..." : "Opret profil"}
        </button>
      </form>
    </div>
  );
}
