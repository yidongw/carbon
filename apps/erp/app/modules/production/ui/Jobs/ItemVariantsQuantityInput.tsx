import type { NumberFieldProps } from "@carbon/react";
import {
  cn,
  Label,
  NumberDecrementStepper,
  NumberField,
  NumberIncrementStepper,
  NumberInput,
  NumberInputGroup,
  NumberInputStepper
} from "@carbon/react";
import type { ReactNode } from "react";
import { LuChevronDown, LuChevronUp, LuTable } from "react-icons/lu";

const defaultFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 10
} satisfies Intl.NumberFormatOptions;

function VariantsQuantityAdornment({
  variantsQuantityTotal
}: {
  variantsQuantityTotal: number;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute right-0 top-0 z-10 m-px flex h-[calc(100%-2px)] w-10 items-center justify-center rounded-r-md border-l border-border transition-colors",
        variantsQuantityTotal > 0 ? "text-emerald-500" : "text-muted-foreground"
      )}
      aria-hidden
    >
      <LuTable size="1em" strokeWidth="3" />
    </div>
  );
}

export type ItemVariantsQuantityInputProps = {
  id: string;
  label?: ReactNode;
  /** When the parent renders FormLabel (e.g. QuantityWithVariantsQuantity). */
  hideLabel?: boolean;
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  size?: "sm" | "md" | "lg";
  formatOptions?: Intl.NumberFormatOptions;
  /** Props merged onto {@link NumberField} (e.g. from form `getInputProps`). Later keys win over built-ins except `value` / `onChange`. */
  numberFieldProps?: Partial<NumberFieldProps>;
  /** When set, show the variants quantity strip inside the control. */
  hasVariantsQuantity: boolean;
  onOpenVariantsQuantity?: () => void;
  /** Sum of configured quantity columns; drives adornment color. */
  variantsQuantityTotal?: number;
  /** `role="button"` wrapper when opening the variants quantity overlay from the field. */
  openVariantsQuantityAccessibilityLabel?: string;
};

/**
 * Quantity field with optional variants quantity table affordance
 * (steppers when no variants grid; table icon opens the variants quantity overlay).
 */
export function ItemVariantsQuantityInput({
  id,
  label,
  hideLabel = false,
  value,
  onChange,
  minValue = 0,
  maxValue,
  isDisabled = false,
  isReadOnly = false,
  size = "md",
  formatOptions = defaultFormatOptions,
  numberFieldProps,
  hasVariantsQuantity,
  onOpenVariantsQuantity,
  variantsQuantityTotal = 0,
  openVariantsQuantityAccessibilityLabel = "Edit variant quantities"
}: ItemVariantsQuantityInputProps) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const canOpenVariantsQuantity =
    hasVariantsQuantity && onOpenVariantsQuantity != null && !isDisabled;
  const showAdornment = canOpenVariantsQuantity;
  const showStepper =
    !showAdornment && !isReadOnly && !isDisabled && size !== "sm";

  const handleChange = (next: number) => {
    onChange(Number.isFinite(next) ? next : 0);
  };

  const field = (
    <NumberField
      {...numberFieldProps}
      id={id}
      value={safeValue}
      onChange={handleChange}
      minValue={minValue}
      maxValue={maxValue}
      formatOptions={formatOptions}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
    >
      <NumberInputGroup className="relative w-full min-w-0">
        <NumberInput
          isReadOnly={isReadOnly}
          isDisabled={isDisabled}
          size={size}
          className={cn(
            "w-full tabular-nums",
            showAdornment && "pr-10",
            isReadOnly &&
              variantsQuantityTotal > 0 &&
              "cursor-pointer text-foreground"
          )}
        />
        {showAdornment ? (
          <VariantsQuantityAdornment
            variantsQuantityTotal={variantsQuantityTotal}
          />
        ) : showStepper ? (
          <NumberInputStepper>
            <NumberIncrementStepper>
              <LuChevronUp size="1em" strokeWidth="3" />
            </NumberIncrementStepper>
            <NumberDecrementStepper>
              <LuChevronDown size="1em" strokeWidth="3" />
            </NumberDecrementStepper>
          </NumberInputStepper>
        ) : null}
      </NumberInputGroup>
    </NumberField>
  );

  const shellClassName =
    "w-full cursor-pointer [&_input]:cursor-pointer [&_input]:pointer-events-none";

  return (
    <div className="flex w-full min-w-0 flex-col gap-1">
      {!hideLabel && label ? <Label htmlFor={id}>{label}</Label> : null}
      {canOpenVariantsQuantity ? (
        <div
          role="button"
          tabIndex={0}
          aria-label={openVariantsQuantityAccessibilityLabel}
          className={shellClassName}
          onClick={onOpenVariantsQuantity}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpenVariantsQuantity();
            }
          }}
        >
          {field}
        </div>
      ) : (
        field
      )}
    </div>
  );
}
