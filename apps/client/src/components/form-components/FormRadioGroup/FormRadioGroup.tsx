import React from "react";
import { Radio } from "@mantine/core";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

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
          labelProps={{
            className: 'label'
          }} 
        >
          {options.map((option) => (
            <Radio key={option.value} value={option.value} label={option.label} />
          ))}
        </Radio.Group>
      )}
    />
  );
};

export default FormRadioGroup;
