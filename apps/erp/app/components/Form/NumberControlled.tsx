import { NumberControlled as NumberControlledBase } from "@carbon/form";
import { type ComponentProps, forwardRef } from "react";
import { useFormatValidationError } from "~/utils/formatValidationError";

type FormNumberControlledProps = ComponentProps<typeof NumberControlledBase>;

const NumberControlled = forwardRef<
  HTMLInputElement,
  FormNumberControlledProps
>(({ formatError: formatErrorProp, ...rest }, ref) => {
  const formatValidationError = useFormatValidationError();

  return (
    <NumberControlledBase
      ref={ref}
      formatError={formatErrorProp ?? formatValidationError}
      {...rest}
    />
  );
});

NumberControlled.displayName = "NumberControlled";

export default NumberControlled;
