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
import { ItemVariantsQuantityInput } from "./ItemVariantsQuantityInput";

export type QuantityWithVariantsQuantityProps = {
  name: string;
  label?: ReactNode;
  helperText?: string;
  isOptional?: boolean;
  isRequired?: boolean;
  isConfigured?: boolean;
  onConfigure?: () => void;
  value: number;
  onChange?: (value: number) => void;
  hasVariantsQuantity: boolean;
  onOpenVariantsQuantity?: () => void;
  /** Sum of configured quantity columns; drives adornment color. */
  variantsQuantityTotal?: number;
  minValue?: number;
  maxValue?: number;
  size?: "sm" | "md" | "lg";
  formatOptions?: Intl.NumberFormatOptions;
  isReadOnly?: boolean;
  isDisabled?: boolean;
};

/**
 * Form-connected quantity with optional variants-quantity affordance (same layout
 * as {@link ItemVariantsQuantityInput}).
 */
export function QuantityWithVariantsQuantity({
  name,
  label,
  helperText,
  isOptional,
  isRequired,
  isConfigured,
  onConfigure,
  value,
  onChange,
  hasVariantsQuantity,
  onOpenVariantsQuantity,
  variantsQuantityTotal = 0,
  minValue = 0,
  maxValue,
  size = "md",
  formatOptions,
  isReadOnly: isReadOnlyProp,
  isDisabled: isDisabledProp
}: QuantityWithVariantsQuantityProps) {
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
      <ItemVariantsQuantityInput
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
        hasVariantsQuantity={hasVariantsQuantity}
        onOpenVariantsQuantity={
          hasVariantsQuantity ? onOpenVariantsQuantity : undefined
        }
        variantsQuantityTotal={variantsQuantityTotal}
        openVariantsQuantityAccessibilityLabel={t`Configure quantities`}
      />
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}
