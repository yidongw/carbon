import type { InputProps } from "@carbon/react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input as InputBase,
  VStack
} from "@carbon/react";
import type { ReactNode } from "react";
import { forwardRef, useRef } from "react";
import { flushSync } from "react-dom";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { useField } from "../hooks";
import { useFormStateContext } from "../internal/formStateContext";
import { useFieldArray } from "../internal/state/fieldArray";

type FormArrayProps = InputProps & {
  name: string;
  label?: string;
  isRequired?: boolean;
  addButtonLabel?: ReactNode;
  removeItemAriaLabel?: string;
  formatError?: (error: string) => ReactNode;
};

const Array = forwardRef<HTMLInputElement, FormArrayProps>(
  (
    {
      name,
      label,
      isRequired,
      addButtonLabel = "New Option",
      removeItemAriaLabel = "Remove item",
      formatError = (error) => error,
      isDisabled: isDisabledProp,
      isReadOnly: isReadOnlyProp,
      ...rest
    },
    ref
  ) => {
    const { isOptional: fieldIsOptional } = useField(name);
    const listRef = useRef<HTMLDivElement>(null);
    const [items, { push, remove }, error] = useFieldArray<string>(name);
    const formState = useFormStateContext();
    const isDisabled = formState.isDisabled || isDisabledProp;
    const isReadOnly = formState.isReadOnly || isReadOnlyProp;
    const resolvedIsOptional = isRequired ? false : (fieldIsOptional ?? false);
    const onAdd = () => {
      flushSync(() => {
        push("");
      });
      const lastInput = listRef.current?.querySelectorAll("input")?.[
        items.length
      ] as HTMLInputElement | undefined;
      lastInput?.focus();
    };

    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && (
          <FormLabel htmlFor={`${name}`} isOptional={resolvedIsOptional}>
            {label}
          </FormLabel>
        )}
        <VStack className="mb-4" ref={listRef}>
          {items.map((item, index) => (
            <ArrayInput
              key={`${item}-${index}`}
              id={`${name}[${index}]`}
              name={`${name}[${index}]`}
              ref={index === 0 ? ref : undefined}
              onRemove={() => remove(index)}
              isDisabled={isDisabled}
              isReadOnly={isReadOnly}
              removeItemAriaLabel={removeItemAriaLabel}
              formatError={formatError}
              {...rest}
            />
          ))}
          <Button
            variant="secondary"
            leftIcon={<IoMdAdd />}
            onClick={onAdd}
            isDisabled={isDisabled || isReadOnly}
          >
            {addButtonLabel}
          </Button>
        </VStack>
        {error && <FormErrorMessage>{formatError(error)}</FormErrorMessage>}
      </FormControl>
    );
  }
);

Array.displayName = "Array";

type ArrayInputProps = InputProps & {
  name: string;
  onRemove: () => void;
  removeItemAriaLabel: string;
  formatError: (error: string) => ReactNode;
};

const ArrayInput = forwardRef<HTMLInputElement, ArrayInputProps>(
  (
    { name, onRemove, removeItemAriaLabel, formatError, isDisabled, isReadOnly, ...rest },
    ref
  ) => {
    const { getInputProps, error } = useField(name);

    return (
      <FormControl isInvalid={!!error} isRequired>
        <HStack className="w-full content-between">
          <InputBase
            ref={ref}
            {...getInputProps({
              id: name,
              ...rest
            })}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
          />
          <IconButton
            variant="ghost"
            aria-label={removeItemAriaLabel}
            icon={<IoMdClose />}
            onClick={onRemove}
            isDisabled={isDisabled || isReadOnly}
          />
        </HStack>

        {error && <FormErrorMessage>{formatError(error)}</FormErrorMessage>}
      </FormControl>
    );
  }
);

ArrayInput.displayName = "ArrayInput";

export default Array;
