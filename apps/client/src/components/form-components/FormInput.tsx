import { Input, InputWrapper, InputProps, InputLabelProps } from '@mantine/core';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import styles from './FormComponents.module.css';

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute; 
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
  type = 'text', // default type is text
  inputProps,
}: FormInputProps<T>) => {
  return (
    <InputWrapper
      label={label}
      description={description}
      required={required}
      classNames={{
        description: styles.description,
      }}
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
            type={type} 
            classNames={{
              input: error ? styles.inputError : styles.input,
            }}
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
