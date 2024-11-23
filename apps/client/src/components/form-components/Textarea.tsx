import React from "react";
import { FieldValues, Controller, Control, Path } from "react-hook-form";
import { Textarea, TextareaProps as MantineTextareaProps, InputWrapper } from "@mantine/core";
import styles from "./FormComponents.module.css";

interface FormTextareaProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  textareaprops?: Omit<MantineTextareaProps, "onChange" | "value">;
  wrapperProps?: React.ComponentPropsWithoutRef<typeof InputWrapper>;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  rows?: number;
  minRows?: number;
  maxRows?: number;
}

// TODO: label props can be deleted, if style for label is moved from app.css to this module, then we can use classnames, should be done for all form components

const FormTextarea = React.memo(<T extends FieldValues>({
  name,
  control,
  label,
  description,
  placeholder,
  required,
  rows,
  textareaprops,
  wrapperProps,
}: FormTextareaProps<T>) => {
  return (
    <InputWrapper
      label={label}
      description={description}
      required={required}
      {...wrapperProps}
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
          <Textarea
            {...field}
            classNames={{
              input: error ? styles.inputError : styles.textarea, 
            }}
            placeholder={placeholder}
            required={required}
            rows={rows}
            error={error?.message}
            {...textareaprops}
          />
        )}
      />
    </InputWrapper>
  );
});


export default FormTextarea;
