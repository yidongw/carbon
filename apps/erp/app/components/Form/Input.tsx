import { Input as InputBase } from "@carbon/form";
import { type ComponentProps, forwardRef } from "react";
import { useFormatValidationError } from "~/utils/formatValidationError";

type FormInputProps = ComponentProps<typeof InputBase>;

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
