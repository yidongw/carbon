import { SelectControlled as SelectControlledBase } from "@carbon/form";
import type { ComponentProps } from "react";
import { useFormatValidationError } from "~/utils/formatValidationError";

type FormSelectControlledProps = ComponentProps<typeof SelectControlledBase>;

const SelectControlled = ({
  formatError: formatErrorProp,
  ...rest
}: FormSelectControlledProps) => {
  const formatValidationError = useFormatValidationError();

  return (
    <SelectControlledBase
      formatError={formatErrorProp ?? formatValidationError}
      {...rest}
    />
  );
};

SelectControlled.displayName = "SelectControlled";

export default SelectControlled;
