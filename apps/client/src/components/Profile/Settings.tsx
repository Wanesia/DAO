import { UpdateSettingsDto, UserProfile } from "@shared/userProfile";
import Button from "../Button/Button";
import { useNavigate } from "@tanstack/react-router";
import styles from "./Settings.module.css";
import FormInput from "../form-components/FormInput";
import { useForm } from "react-hook-form";
import { updateUserSettings } from "../../api/userApi";
import DeleteButton from "../Button/DeleteButton";
interface ProfileInfoProps {
  user: UserProfile;
}

const Settings: React.FC<ProfileInfoProps> = ({ user }) => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    setError,
    control,
    formState: {  isSubmitting },
  } = useForm<UpdateSettingsDto>({
    defaultValues: {
      password: "",
      newPassword: "",
      isSubscribedToNewsletter: user.isSubscribedToNewsletter,
    },
  });

  const onSubmit = async (data: UpdateSettingsDto) => {
    console.log("Form submitted:", data);
    try {
      await updateUserSettings(user._id, data)
      navigate({ to: "/profile" });
    } catch (error) {
      console.error(error);
      setError("password", { message: "Please enter correct password first." });
    }
  };

  return (
    <div className={styles.main}>
      <Button
        type="button"
        color="white-slim"
        text="Tilbage"
        onClick={() => navigate({ to: "/profile" })}
      />
      <h2>Indstillinger</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Skift adgangskode</h3>
        <FormInput
          name="password"
          type="password"
          placeholder="Adgangskode"
          control={control}
        />
        <FormInput
          name="newPassword"
          type="password"
          placeholder="Ny adgangskode"
          control={control}
          rules={{
            minLength: {
              value: 8,
              message: "New password must be at least 8 characters",
            },
          }}
        />

        <h3>Nyhedsbreve</h3>
        <div className={styles.checkbox}>
          <label className={styles.checkbox} htmlFor="isSubscribedToNewsletter">
            <input
              type="checkbox"
              {...control.register("isSubscribedToNewsletter")}
            />
            Tilmeld mig DAOS nyhedsbrev
          </label>
        </div>

        <h3>Profil</h3>
        <div className={styles.buttons}>
          <DeleteButton userId={user._id}></DeleteButton>
          <Button
            type="submit"
            color="blue"
            text="Gem Indstillinger"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default Settings;
