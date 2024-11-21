import React from "react";
import { Radio } from "@mantine/core";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import styles from "./FormComponents.module.css";

interface RadioGroupOption {
  value: string;
  label: string;
}

interface FormRadioGroupProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: RadioGroupOption[];
  label?: string;
  description?: string;
  required?: boolean;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  inputProps?: React.ComponentPropsWithoutRef<typeof Radio>;
}

const FormRadioGroup = <T extends FieldValues>({
  name,
  control,
  options,
  label,
  description,
  required,
}: FormRadioGroupProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Radio.Group
          label={label}
          description={description}
          value={field.value}
          onChange={field.onChange}
          required={required}
          classNames={{
            description: styles.description,
          }}
          labelProps={{
            className: "label",
          }}
        >
          {options.map((option) => (
            <Radio
              key={option.value}
              value={option.value}
              label={option.label}
              classNames={{
                label: styles.radioLabel,
              }}
            />
          ))}
        </Radio.Group>
      )}
    />
  );
};

export default FormRadioGroup;
