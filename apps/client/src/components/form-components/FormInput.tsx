import { Input, InputWrapper, InputProps, InputLabelProps } from '@mantine/core';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  inputProps?: InputProps;
  labelProps?: InputLabelProps;
}

const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  description,
  placeholder,
  required,
  inputProps,
}: FormInputProps<T>) => {
  return (
    <InputWrapper
      label={label}
      description={description}
      required={required}
      labelProps={{
        className: 'label',
      }}
    >
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            placeholder={placeholder}
            required={required}
            error={error?.message} 
            {...inputProps}
          />
        )}
      />
    </InputWrapper>
  );
};

export default FormInput;
