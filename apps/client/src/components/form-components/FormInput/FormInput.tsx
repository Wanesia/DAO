import { Input, InputProps } from '@mantine/core';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  inputProps?: InputProps; 
}

const FormInput = <T extends FieldValues>({
  name,
  control,
  placeholder,
  required,
  inputProps,
}: FormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          placeholder={placeholder}
          required={required}
          {...inputProps}
        />
      )}
    />
  );
};

export default FormInput;
