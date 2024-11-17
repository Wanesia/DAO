import styles from "./LoginForm.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";

type FormFields = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();


  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await login(data.email, data.password);
      navigate({ to: "/profile" });
    } catch (error: any) {
      setError("root", { message: error.message || "Invalid email or password" });
    }
  };


  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h1>Log ind</h1>
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
          {isSubmitting ? "Loading..." : "Log ind"}
        </button>
        {errors.root && (
          <div className={styles.error}>{errors.root.message}</div>
        )}
        <p className={styles.reset}>Glemt adgangskode?</p>
      </form>
    </div>
  );
}
