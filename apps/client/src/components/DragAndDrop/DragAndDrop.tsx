import { useState, DragEvent, ChangeEvent } from "react";
import styles from "./DragAndDrop.module.css";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

type DragDropProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  size: "small" | "large";
  placeholderImage: string;
  buttonLabel: string;
  required?: boolean; 
};

const DragAndDrop = <T extends FieldValues>({
  name,
  control,
  label,
  size,
  placeholderImage,
  buttonLabel,
  required,
}: DragDropProps<T>) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className={styles.dragDropContainer}>
      {label && <label className={styles.mainLabel}>{label}</label>}
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? "This field is required" : undefined,
        }}
        render={({ field, fieldState: { error } }) => (
          <>
            <div className={`${styles.container} ${styles[size]}`}>
              <div
                className={`${styles.dragDropArea} ${
                  isDragging ? styles.dragging : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile) {
                    setPreview(URL.createObjectURL(droppedFile)); 
                    field.onChange(droppedFile); 
                  }
                }}
              >
                <div
                  className={styles.backgroundImage}
                  style={{ backgroundImage: `url(${preview || placeholderImage})` }}
                />
                {size === "large" && !preview && (
                  <div className={styles.overlay}>
                    <p>Drag & drop a file here or click below to upload</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                id={`${name}-file-upload`}
                style={{ display: "none" }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file)); 
                    field.onChange(file); 
                  }
                }}
              />
              <label htmlFor={`${name}-file-upload`} className={styles.uploadButton}>
                {buttonLabel}
              </label>
            </div>
            {error && <p className={styles.error}>{error.message}</p>}
          </>
        )}
      />
    </div>
  );
};

export default DragAndDrop;
