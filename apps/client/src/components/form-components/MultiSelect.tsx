import React from "react";
import { MultiSelect, MultiSelectProps as MantineMultiSelectProps } from "@mantine/core";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

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
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error: fieldError } }) => (
        <MultiSelect
          label={label}
          description={description}
          required={required}
          error={fieldError?.message || error}
          data={options}
          value={field.value || []} 
          onChange={field.onChange}
          {...selectProps}
        />
      )}
    />
  );
};

export default React.memo(FormMultiSelect);
