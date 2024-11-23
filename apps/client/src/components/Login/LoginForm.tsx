import styles from "./LoginForm.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";
import FormInput from "../form-components/FormInput";
import Button from "../Button/Button";

type FormFields = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<FormFields>();

  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await login({ email: data.email, password: data.password });
      navigate({ to: "/profile" });
    } catch (error: any) {
      setError("root", {
        message: "Invalid email or password",
      });
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h1>Log ind</h1>
        <FormInput
          name="email"
          type="email"
          placeholder="E-mail"
          control={control}
          required
          label="E-mail"
          inputProps={{
            error: errors.email?.message,
          }}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Adgangskode"
          control={control}
          required
          label="Adgangskode"
          inputProps={{
            error: errors.password?.message,
          }}
        />

        <Button type="submit" text="Log ind" color="blue" />
        {errors.root && (
          <div className={styles.error}>{errors.root.message}</div>
        )}
        <p className={styles.reset}>Glemt adgangskode?</p>
      </form>
    </div>
  );
}
