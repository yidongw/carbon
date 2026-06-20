import { Input as InputBase } from "@carbon/form";
import type { InputProps } from "@carbon/react";
import { forwardRef } from "react";
import { useFormatValidationError } from "~/utils/formatValidationError";

type FormInputProps = InputProps & {
  name: string;
  label?: React.ReactNode;
  isConfigured?: boolean;
  isOptional?: boolean;
  isRequired?: boolean;
  helperText?: string;
  prefix?: string;
  suffix?: string;
  formatError?: (error: string) => React.ReactNode;
  onConfigure?: () => void;
};

const Input = forwardRef<HTMLInputElement, FormInputProps>(
  ({ formatError: formatErrorProp, ...rest }, ref) => {
    const formatValidationError = useFormatValidationError();

    return (
      <InputBase
        ref={ref}
        formatError={formatErrorProp ?? formatValidationError}
        {...rest}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
