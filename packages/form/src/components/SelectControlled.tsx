import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel
} from "@carbon/react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { useControlField, useField } from "../hooks";
import { useFormStateContext } from "../internal/formStateContext";
import type { SelectBaseProps } from "./Select";
import { SelectBase } from "./Select";

export type SelectProps = Omit<SelectBaseProps, "onChange"> & {
  name: string;
  label?: string;
  helperText?: string;
  isConfigured?: boolean;
  isOptional?: boolean;
  formatError?: (error: string) => ReactNode;
  options: { value: string | number; label: string | JSX.Element }[];
  onChange?: (
    newValue: { value: string; label: string | JSX.Element } | null
  ) => void;
  onConfigure?: () => void;
};

const SelectControlled = ({
  name,
  label,
  helperText,
  options,
  isConfigured,
  isOptional,
  onConfigure,
  formatError = (error) => error,
  ...props
}: SelectProps) => {
  const {
    getInputProps,
    error,
    validate,
    clearError,
    isOptional: fieldIsOptional
  } = useField(name);
  const formState = useFormStateContext();
  const isDisabled = formState.isDisabled || props.isDisabled;
  const isReadOnly = formState.isReadOnly || props.isReadOnly;
  const resolvedIsOptional = isOptional ?? fieldIsOptional ?? false;
  const [controlValue, setControlValue] = useControlField<string | undefined>(
    name
  );
  const hasMounted = useRef(false);

  // Prefer the React-controlled `value` prop. TabsContent (and similar) unmount
  // fields when inactive; unregister resets the form store to defaultValues, so
  // after remount controlValue is empty even when the parent still holds the
  // selection. Without this, Method (etc.) appears blank after switching tabs.
  const resolvedValue =
    props.value !== null && props.value !== undefined
      ? props.value
      : controlValue;

  useEffect(() => {
    if (props.value !== null && props.value !== undefined)
      setControlValue(props.value);
  }, [props.value, setControlValue]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    // Parent-driven updates (e.g. item pick preloading Method) bypass the
    // select's own onChange. Only clear a stale error when a real value lands —
    // never validate an empty value here or "required" flashes on first open.
    if (props.value) {
      clearError();
    }
  }, [props.value, clearError]);

  const onChange = (value: string) => {
    if (value) {
      // String() guards against options declared with non-string values
      // (Radix always emits strings from the trigger).
      props?.onChange?.(options.find((o) => String(o.value) === value) ?? null);
    } else {
      props?.onChange?.(null);
    }
  };

  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormLabel
          htmlFor={name}
          isConfigured={isConfigured}
          isOptional={resolvedIsOptional}
          onConfigure={onConfigure}
        >
          {label}
        </FormLabel>
      )}
      <input
        {...getInputProps({
          id: name
        })}
        type="hidden"
        name={name}
        id={name}
        value={resolvedValue}
      />
      <SelectBase
        {...props}
        options={options}
        value={resolvedValue}
        onChange={(newValue) => {
          setControlValue(newValue ?? "");
          onChange(newValue ?? "");
          // The value lands in form state, not on the hidden input, so the
          // input's own onChange never fires — revalidate here or a submitted
          // error stays on screen after the user picks a valid option.
          validate();
        }}
        isClearable={resolvedIsOptional && !isReadOnly}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        className="w-full"
      />

      {error ? (
        <FormErrorMessage>{formatError(error)}</FormErrorMessage>
      ) : (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

SelectControlled.displayName = "SelectControlled";

export default SelectControlled;
