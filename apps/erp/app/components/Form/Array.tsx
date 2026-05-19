import { Array as ArrayBase } from "@carbon/form";
import type { InputProps } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { forwardRef } from "react";
import { useFormatValidationError } from "~/utils/formatValidationError";

type ArrayProps = InputProps & {
  name: string;
  label?: string;
  isRequired?: boolean;
  addButtonLabel?: React.ReactNode;
  removeItemAriaLabel?: string;
  formatError?: (error: string) => React.ReactNode;
};

const Array = forwardRef<HTMLInputElement, ArrayProps>(
  (
    {
      formatError: formatErrorProp,
      addButtonLabel,
      removeItemAriaLabel,
      ...rest
    },
    ref
  ) => {
    const { t } = useLingui();
    const formatValidationError = useFormatValidationError();
    const formatError = formatErrorProp ?? formatValidationError;

    return (
      <ArrayBase
        ref={ref}
        addButtonLabel={addButtonLabel ?? t`New Option`}
        removeItemAriaLabel={removeItemAriaLabel ?? t`Remove item`}
        formatError={formatError}
        {...rest}
      />
    );
  }
);

Array.displayName = "Array";

export default Array;
