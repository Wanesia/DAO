import React from "react";
import { FieldValues, Controller, Control, Path } from "react-hook-form";
import { Textarea, TextareaProps as MantineTextareaProps, InputWrapper } from "@mantine/core";

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
}

const FormTextarea = React.memo(<T extends FieldValues>({
  name,
  control,
  label,
  description,
  placeholder,
  required,
  textareaprops,
  wrapperProps,
}: FormTextareaProps<T>) => {
  return (
    <InputWrapper
      label={label}
      description={description}
      required={required}
      {...wrapperProps}
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
            placeholder={placeholder}
            required={required}
            error={error?.message}
            {...textareaprops}
          />
        )}
      />
    </InputWrapper>
  );
});


export default FormTextarea;
