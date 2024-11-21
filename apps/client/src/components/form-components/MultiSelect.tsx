import React from "react";
import { MultiSelect, MultiSelectProps as MantineMultiSelectProps, InputWrapper } from "@mantine/core";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import styles from "./FormComponents.module.css";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: MultiSelectOption[];
  label?: string;
  description?: string;
  error?: string;
  selectProps?: Omit<MantineMultiSelectProps, "data" | "value" | "onChange">;
  required?: boolean;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>; 
}

const FormMultiSelect = <T extends FieldValues>({
  name,
  control,
  options,
  label,
  description,
  error,
  selectProps,
  required,
}: MultiSelectProps<T>) => {
  return (
    <InputWrapper
    label={label}
    description={description}
    required={required}
    error={error}
    labelProps={{
      className: 'label',
    }}
  >
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error: fieldError } }) => (
        <MultiSelect
          classNames={{
            input: error ? styles.inputError : styles.multiselect, 
          }}
          error={fieldError?.message || error}
          data={options}
          value={field.value || []} 
          onChange={field.onChange}
          {...selectProps}
        />
      )}
    />
    </InputWrapper>
  );
};

export default React.memo(FormMultiSelect);
