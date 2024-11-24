import { Input, InputWrapper, InputProps } from '@mantine/core';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import styles from './FormComponents.module.css';

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute;
  inputProps?: Omit<InputProps, 'error'>; 
  rules?: RegisterOptions<T>; 
  disabled?: boolean;
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
  rules,
  disabled,
}: FormInputProps<T>) => {
  return (
    <InputWrapper
      label={label}
      description={description}
      required={required}
      error={control.getFieldState(name)?.error?.message}
      classNames={{
        description: styles.description,
        label: styles.label,
      }}
  
    >
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            type={type} 
            classNames={{
              input: error ? styles.inputError : styles.input,
            }}
            disabled={disabled}
            placeholder={placeholder}
            {...inputProps}
          />
        )}
      />
    </InputWrapper>
  );
};

export default FormInput;
