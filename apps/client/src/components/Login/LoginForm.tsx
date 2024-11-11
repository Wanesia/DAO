import styles from "./LoginForm.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

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
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
        const response = await axios.post("http://localhost:3000/auth/login", data);
        console.log("Logged in:", response.data);
    } catch (error) {
        setError("root",{message:"Invalid email or password"});
    }
  };
  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
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
        placeholder="Email"
      />
      {errors.email && <div className="error">{errors.email.message}</div>}
      <input
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
        type="password"
        placeholder="Password"
      />
      {errors.password && (
        <div className="error">{errors.password.message}</div>
      )}

      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Loading..." : "Log ind"}
      </button>
      {errors.root && <div className="error">{errors.root.message}</div>}
    </form>
  );
}
