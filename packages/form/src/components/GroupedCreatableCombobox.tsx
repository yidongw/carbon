import type { GroupedCreatableComboboxProps as GroupedCreatableComboboxBaseProps } from "@carbon/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  GroupedCreatableCombobox as GroupedCreatableComboboxBase
} from "@carbon/react";
import { forwardRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { useControlField, useField } from "../hooks";
import { useFormStateContext } from "../internal/formStateContext";

export type GroupedCreatableComboboxProps = Omit<
  GroupedCreatableComboboxBaseProps,
  "onChange"
> & {
  autoSelectSingleOption?: boolean;
  isClearable?: boolean;
  name: string;
  label?: string | JSX.Element;
  helperText?: string;
  isConfigured?: boolean;
  isOptional?: boolean;
  isRequired?: boolean;
  onChange?: (
    newValue: {
      value: string;
      label: string | React.ReactNode;
    } | null
  ) => void;
  onConfigure?: () => void;
};

const GroupedCreatableCombobox = forwardRef<
  HTMLButtonElement,
  GroupedCreatableComboboxProps
>(
  (
    {
      autoSelectSingleOption = false,
      isClearable,
      name,
      label,
      helperText,
      isConfigured = false,
      isOptional,
      isRequired,
      onConfigure,
      ...props
    },
    ref
  ) => {
    const {
      getInputProps,
      error,
      isOptional: fieldIsOptional
    } = useField(name);
    const [value, setValue] = useControlField<string | undefined>(name);
    const formState = useFormStateContext();
    const isReadOnly =
      formState.isReadOnly || formState.isDisabled || props.isReadOnly;
    const resolvedIsOptional =
      isOptional ?? (isRequired ? false : (fieldIsOptional ?? false));

    const flatOptions = props.groups.flatMap((group) => group.options);

    useEffect(() => {
      if (props.value !== null && props.value !== undefined) {
        setValue(props.value);
      }
    }, [props.value, setValue]);

    useEffect(() => {
      if (
        autoSelectSingleOption &&
        flatOptions.length === 1 &&
        !value
      ) {
        setValue(flatOptions[0]!.value);
      }
    }, [autoSelectSingleOption, flatOptions, setValue, value]);

    const onChange = (nextValue: string) => {
      if (nextValue) {
        props?.onChange?.(
          flatOptions.find((o) => o.value === nextValue) ?? null
        );
      } else {
        props?.onChange?.(null);
      }
    };

    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && (
          <FormLabel
            htmlFor={name}
            isConfigured={isConfigured}
            onConfigure={onConfigure}
            isOptional={resolvedIsOptional}
          >
            {label}
          </FormLabel>
        )}
        <input
          {...getInputProps({
            id: name,
            value: value
          })}
          type="hidden"
          name={name}
          id={name}
        />
        <GroupedCreatableComboboxBase
          ref={ref}
          {...props}
          value={value?.replace(/"/g, '\\"')}
          isClearable={isClearable ?? (resolvedIsOptional && !isReadOnly)}
          isReadOnly={isReadOnly}
          className="w-full"
          onChange={(newValue) => {
            flushSync(() => {
              setValue(newValue?.replace(/"/g, '\\"') ?? "");
            });
            onChange(newValue?.replace(/"/g, '\\"') ?? "");
          }}
        />
        {error ? (
          <FormErrorMessage>{error}</FormErrorMessage>
        ) : (
          helperText && <FormHelperText>{helperText}</FormHelperText>
        )}
      </FormControl>
    );
  }
);

GroupedCreatableCombobox.displayName = "GroupedCreatableCombobox";

export default GroupedCreatableCombobox;
