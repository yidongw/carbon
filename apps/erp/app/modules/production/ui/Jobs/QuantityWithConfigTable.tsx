import { useControlField, useField, useFormStateContext } from "@carbon/form";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel
} from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { ItemConfigQuantityInput } from "./ItemConfigQuantityInput";

export type QuantityWithConfigTableProps = {
  name: string;
  label?: ReactNode;
  helperText?: string;
  isOptional?: boolean;
  isRequired?: boolean;
  isConfigured?: boolean;
  onConfigure?: () => void;
  value: number;
  onChange?: (value: number) => void;
  hasConfigurationParameters: boolean;
  onOpenConfigTable: () => void;
  /** Sum of configured quantity columns; drives adornment color. */
  configTableTotal?: number;
  minValue?: number;
  maxValue?: number;
  size?: "sm" | "md" | "lg";
  formatOptions?: Intl.NumberFormatOptions;
  isReadOnly?: boolean;
  isDisabled?: boolean;
};

/**
 * Form-connected quantity with optional config-table affordance (same layout
 * as {@link ItemConfigQuantityInput}).
 */
export function QuantityWithConfigTable({
  name,
  label,
  helperText,
  isOptional,
  isRequired,
  isConfigured,
  onConfigure,
  value,
  onChange,
  hasConfigurationParameters,
  onOpenConfigTable,
  configTableTotal = 0,
  minValue = 0,
  maxValue,
  size = "md",
  formatOptions,
  isReadOnly: isReadOnlyProp,
  isDisabled: isDisabledProp
}: QuantityWithConfigTableProps) {
  const { t } = useLingui();
  const { getInputProps, error, isOptional: fieldIsOptional } = useField(name);
  const [controlValue, setControlValue] = useControlField<number>(name);
  const formState = useFormStateContext();
  const isReadOnly = formState.isReadOnly || isReadOnlyProp;
  const isDisabled = formState.isDisabled || isDisabledProp;

  useEffect(() => {
    setControlValue(value);
  }, [value, setControlValue]);

  const handleChange = (newValue: number) => {
    setControlValue(newValue);
    onChange?.(newValue);
  };

  const resolvedIsOptional =
    isOptional ?? (isRequired ? false : (fieldIsOptional ?? false));

  const resolvedFormat =
    formatOptions ??
    ({
      minimumFractionDigits: 0,
      maximumFractionDigits: 10
    } satisfies Intl.NumberFormatOptions);

  return (
    <FormControl
      isInvalid={!!error}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
    >
      {label ? (
        <FormLabel
          htmlFor={name}
          isOptional={resolvedIsOptional}
          isConfigured={isConfigured}
          onConfigure={onConfigure}
        >
          {label}
        </FormLabel>
      ) : null}
      <ItemConfigQuantityInput
        hideLabel
        id={name}
        numberFieldProps={getInputProps()}
        value={controlValue}
        onChange={handleChange}
        minValue={minValue}
        maxValue={maxValue}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        size={size}
        formatOptions={resolvedFormat}
        hasConfigurationParameters={hasConfigurationParameters}
        onOpenConfigTable={
          hasConfigurationParameters ? onOpenConfigTable : undefined
        }
        configTableTotal={configTableTotal}
        openConfigAccessibilityLabel={t`Configure quantities`}
      />
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}
