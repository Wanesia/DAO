import { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import SelectEnsemble from "../../components/SelectEnsemble/SelectEnsemble";
import PostForm from "../../components/PostForm/PostForm";
import styles from "./Posts.module.css";
import { createPost } from "../../api/postApi";
import { useNavigate, redirect, createFileRoute } from "@tanstack/react-router";
import Button from "../../components/Button/Button";
import { useNotification } from "../../context/NotificationContext";
import { add } from "lodash";

export const Route = createFileRoute("/posts/create-post")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isTokenValid()) {
      throw redirect({
        to: "/login",
        search: { redirect: window.location.href },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [currentStep, setCurrentStep] = useState(1);
  const { control, handleSubmit, setValue, setError } =
    useForm<FieldValues>();

  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const handleNext = () => setCurrentStep(2);
  const handleBack = () => setCurrentStep(1);

  const onSubmit = async (data: FieldValues) => {
    try {
      const formData = {
        title: data.title,
        description: data.description,
        ensembleId: data.ensembleId,
        instrument: {
          name: data.name,
          level: parseInt(data.level),
          genres: data.genres
        },
        location: {
          city: data.city,
          postCode: data.postcode,
        },
      };

      const result = await createPost(formData);
      if (result.success) {
        addNotification("success", "Post oprettet med succes!");
        navigate({ to: "/profile" });
      } else {
        addNotification("error", "Der opstod en fejl. Prøv venligst igen.");
      }
    } catch (error) {
      addNotification("error", "Der opstod en fejl. Prøv venligst igen.");
    }
  };

  return (
    <main className="main-form">
      {currentStep === 2 && (
        <Button
          color="white-slim"
          text="Tilbage"
          type="button"
          onClick={handleBack}
        />
      )}
      <section>
        <h2 className={styles.heading}>Opret opslag</h2>
        {currentStep === 1 ? (
          <SelectEnsemble
            onNext={handleNext}
            control={control}
            setValue={setValue}
          />
        ) : (
          <PostForm
            control={control}
            handleSubmit={handleSubmit(onSubmit)}
          />
        )}
      </section>
    </main>
  );
}

export default RouteComponent;
