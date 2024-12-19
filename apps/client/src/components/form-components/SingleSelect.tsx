import React from "react";
import { Select, InputWrapper, SelectProps as MantineSelectProps } from "@mantine/core";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import styles from "./FormComponents.module.css";

interface SingleSelectOption {
  value: string;
  label: string;
}

interface SingleSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: SingleSelectOption[];
  label?: string;
  description?: string;
  error?: string | null;
  selectProps?: Omit<MantineSelectProps, "data" | "value" | "onChange">;
  required?: boolean;
}

const SingleSelect = <T extends FieldValues>({
  name,
  control,
  options,
  label,
  description,
  error,
  selectProps,
  required,
}: SingleSelectProps<T>) => {
  return (
    <InputWrapper
      label={label}
      description={description}
      required={required}
      classNames={{
        description: styles.description,
        label: styles.label,
      }}
    >
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error: fieldError } }) => (
          <Select
            data={options}
            value={field.value}
            onChange={field.onChange}
            classNames={{
              input: error ? styles.inputError : styles.select, 
              dropdown: styles.dropdown,
            }}
            error={fieldError?.message || error}
            {...selectProps}
          />
        )}
      />
    </InputWrapper>
  );
};

export default React.memo(SingleSelect);
