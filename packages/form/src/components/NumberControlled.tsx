import { useFormContext } from "@carbon/form";
import type { NumberFieldProps } from "@carbon/react";
import {
  cn,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  NumberDecrementStepper,
  NumberField,
  NumberIncrementStepper,
  NumberInput,
  NumberInputGroup,
  NumberInputStepper,
  VStack
} from "@carbon/react";
import type { ReactNode } from "react";
import { forwardRef, useEffect, useRef, useState } from "react";
import {
  LuChevronDown,
  LuChevronUp,
  LuPlus,
  LuSettings2
} from "react-icons/lu";
import { useControlField, useField } from "../hooks";
import { useFormStateContext } from "../internal/formStateContext";

type FormNumberProps = NumberFieldProps & {
  name: string;
  label?: ReactNode;
  size?: "sm" | "md" | "lg";
  isOptional?: boolean;
  isRequired?: boolean;
  helperText?: string;
  value: number;
  inline?: boolean;
  isConfigured?: boolean;
  onChange?: (newValue: number) => void;
  onConfigure?: () => void;
  adornment?: ReactNode;
};

const Number = forwardRef<HTMLInputElement, FormNumberProps>(
  (
    {
      name,
      label,
      size,
      isConfigured,
      isOptional,
      isRequired,
      isReadOnly: isReadOnlyProp,
      isDisabled: isDisabledProp,
      helperText,
      value,
      onChange,
      onConfigure,
      adornment,
      inline = false,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const formState = useFormStateContext();
    const isReadOnly = formState.isReadOnly || isReadOnlyProp;
    const isDisabled = formState.isDisabled || isDisabledProp;
    const { validate } = useFormContext();
    const {
      getInputProps,
      error,
      isOptional: fieldIsOptional
    } = useField(name);
    const [controlValue, setControlValue] = useControlField<number>(name);
    const [inlineMode, setInlineMode] = useState(inline);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setControlValue(value);
    }, [setControlValue, value]);

    useEffect(() => {
      setInlineMode(inline);
    }, [inline]);

    useEffect(() => {
      if (inline && !inlineMode) {
        inputRef.current?.focus();
      }
    }, [inline, inlineMode]);

    const handleChange = (newValue: number) => {
      setControlValue(newValue);
      onChange?.(newValue);
    };
    const resolvedIsOptional =
      isOptional ?? (isRequired ? false : (fieldIsOptional ?? false));

    return inlineMode ? (
      <VStack>
        {label && (
          <span className="text-xs text-muted-foreground">{label}</span>
        )}
        <HStack spacing={0} className="w-full justify-between">
          {value !== undefined && (
            <span className="flex flex-grow line-clamp-1 items-center">
              {value}
            </span>
          )}
          <IconButton
            icon={
              value !== undefined && !isNaN(value) ? (
                <LuSettings2 />
              ) : (
                <LuPlus />
              )
            }
            aria-label={value !== undefined && !isNaN(value) ? "Edit" : "Add"}
            size="sm"
            variant="secondary"
            isDisabled={isReadOnly || isDisabled}
            onClick={() => setInlineMode(false)}
          />
        </HStack>
      </VStack>
    ) : (
      <FormControl
        isInvalid={!!error}
        isRequired={isRequired}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
      >
        {label && (
          <FormLabel
            htmlFor={name}
            isOptional={resolvedIsOptional}
            isConfigured={isConfigured}
            onConfigure={onConfigure}
          >
            {label}
          </FormLabel>
        )}
        <NumberField
          {...getInputProps({
            id: name,
            ...rest
          })}
          value={controlValue}
          onChange={handleChange}
          isDisabled={isDisabled}
          onBlur={async (e) => {
            if (inline) {
              const result = await validate();
              if (!result.error) {
                onBlur?.(e);
                setInlineMode(true);
              }
            } else {
              onBlur?.(e);
            }
          }}
        >
          <NumberInputGroup className="relative">
            <NumberInput
              isReadOnly={isReadOnly}
              isDisabled={isDisabled}
              size={size}
              className={
                adornment
                  ? cn(
                      "pr-10",
                      isDisabled &&
                        "text-foreground disabled:opacity-100 disabled:text-foreground"
                    )
                  : undefined
              }
            />
            {!isReadOnly &&
              (adornment ?? (
                <NumberInputStepper>
                  <NumberIncrementStepper>
                    <LuChevronUp size="1em" strokeWidth="3" />
                  </NumberIncrementStepper>
                  <NumberDecrementStepper>
                    <LuChevronDown size="1em" strokeWidth="3" />
                  </NumberDecrementStepper>
                </NumberInputStepper>
              ))}
          </NumberInputGroup>
        </NumberField>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

Number.displayName = "Number";

export default Number;
