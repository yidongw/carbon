import { useLingui } from "@lingui/react/macro";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { forwardRef, useMemo, useState } from "react";
import { LuCheck, LuPlus, LuSettings2, LuX } from "react-icons/lu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandTrigger
} from "./Command";
import { HStack } from "./HStack";
import { IconButton } from "./IconButton";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { TruncatedTooltipText } from "./TruncatedTooltipText";
import { cn } from "./utils/cn";
import { reactNodeToString } from "./utils/react";

const CREATE_PREFIX = "__create__:";

export type GroupedCreatableComboboxOption = {
  label: string | JSX.Element;
  value: string;
  helper?: string;
  helperRight?: string;
};

export type GroupedCreatableComboboxGroup = {
  id: string;
  heading: string | ReactNode;
  options: GroupedCreatableComboboxOption[];
  onCreateOption?: () => void;
  /** Defaults to `Create {heading}` when omitted. */
  createLabel?: string | ReactNode;
};

export type GroupedCreatableComboboxProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "onChange"
> & {
  size?: "sm" | "md" | "lg";
  value?: string;
  groups: GroupedCreatableComboboxGroup[];
  isClearable?: boolean;
  isReadOnly?: boolean;
  placeholder?: string;
  inline?: (
    value: string,
    options: GroupedCreatableComboboxOption[]
  ) => ReactNode;
  inlineAddLabel?: string;
  onChange?: (selected: string) => void;
  itemHeight?: number;
};

function optionSearchText(option: GroupedCreatableComboboxOption) {
  const labelText =
    typeof option.label === "string"
      ? option.label
      : reactNodeToString(option.label);
  return [labelText, option.helper, option.helperRight]
    .filter(Boolean)
    .join(" ");
}

function matchesSearch(text: string, search: string) {
  return text.toLowerCase().includes(search.toLowerCase());
}

const GroupedCreatableCombobox = forwardRef<
  HTMLButtonElement,
  GroupedCreatableComboboxProps
>(
  (
    {
      size,
      value,
      groups,
      isClearable,
      isReadOnly,
      placeholder,
      onChange,
      inline,
      inlineAddLabel,
      itemHeight = 40,
      ...props
    },
    ref
  ) => {
    const { t } = useLingui();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const isInlinePreview = !!inline;

    const flatOptions = useMemo(
      () => groups.flatMap((group) => group.options),
      [groups]
    );

    const selectedOption = useMemo(
      () => flatOptions.find((option) => option.value === value),
      [flatOptions, value]
    );

    const selectedOptionText = useMemo(() => {
      if (!selectedOption) return undefined;
      return optionSearchText(selectedOption);
    }, [selectedOption]);

    const filteredGroups = useMemo(() => {
      const trimmed = search.trim();
      return groups
        .map((group) => {
          const options = trimmed
            ? group.options.filter((option) =>
                matchesSearch(optionSearchText(option), trimmed)
              )
            : group.options;
          const showCreate =
            !!group.onCreateOption &&
            (!trimmed ||
              matchesSearch(
                typeof group.heading === "string"
                  ? group.heading
                  : reactNodeToString(group.heading),
                trimmed
              ) ||
              matchesSearch(
                typeof group.createLabel === "string"
                  ? group.createLabel
                  : group.createLabel
                    ? reactNodeToString(group.createLabel)
                    : `Create ${typeof group.heading === "string" ? group.heading : ""}`,
                trimmed
              ));
          return { ...group, options, showCreate };
        })
        .filter(
          (group) => group.options.length > 0 || group.showCreate
        );
    }, [groups, search]);

    const dropdownContentWidthCh = useMemo(() => {
      const allOptions = groups.flatMap((g) => g.options);
      if (allOptions.length === 0) return undefined;

      const maxOptionChars = allOptions.reduce((longest, option) => {
        return Math.max(longest, optionSearchText(option).length);
      }, 0);

      return Math.min(72, Math.max(36, maxOptionChars + 8));
    }, [groups]);

    return (
      <HStack
        className={cn(isInlinePreview ? "w-full" : "w-full min-w-0 shrink-0")}
        spacing={1}
      >
        {isInlinePreview && value && (
          <span className="flex flex-grow line-clamp-1 items-center">
            {inline(value, flatOptions)}
          </span>
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger disabled={isReadOnly} asChild>
            {inline ? (
              <HStack>
                <IconButton
                  size={size ?? "sm"}
                  variant="secondary"
                  aria-label={value ? "Edit" : "Add"}
                  icon={value ? <LuSettings2 /> : <LuPlus />}
                  ref={ref}
                  isDisabled={isReadOnly}
                  disabled={isReadOnly}
                  onClick={() => {
                    if (!isReadOnly) setOpen(true);
                  }}
                  className="transition-transform active:scale-[0.96]"
                />
                {!value && inlineAddLabel && (
                  <span className="text-muted-foreground text-sm">
                    {inlineAddLabel}
                  </span>
                )}
              </HStack>
            ) : (
              <CommandTrigger
                size={size}
                role="combobox"
                className={cn(
                  "min-w-[160px]",
                  !value && "text-muted-foreground truncate"
                )}
                ref={ref}
                {...props}
                disabled={isReadOnly}
                onClick={() => setOpen(true)}
              >
                {value ? (
                  <TruncatedTooltipText
                    className="block min-w-0 flex-1 truncate text-left"
                    tooltip={selectedOptionText}
                  >
                    {selectedOption?.label}
                  </TruncatedTooltipText>
                ) : (
                  <span className="!text-muted-foreground">
                    {placeholder ?? t`Select`}
                  </span>
                )}
              </CommandTrigger>
            )}
          </PopoverTrigger>
          <PopoverContent
            align="start"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="min-w-[--radix-popover-trigger-width] max-w-[min(560px,calc(100vw-2rem))] p-1"
            style={{
              width: dropdownContentWidthCh
                ? `min(560px, max(var(--radix-popover-trigger-width), ${dropdownContentWidthCh}ch))`
                : "var(--radix-popover-trigger-width)"
            }}
          >
            <Command shouldFilter={false}>
              <CommandInput
                value={search}
                onValueChange={setSearch}
                placeholder={t`Search...`}
                className="h-9"
              />
              <CommandList
                className="max-h-[min(320px,50vh)] overflow-y-auto overscroll-contain"
                onWheel={(e) => e.stopPropagation()}
              >
                {filteredGroups.length === 0 ? (
                  <CommandEmpty>{t`No results found.`}</CommandEmpty>
                ) : (
                  filteredGroups.map((group, groupIndex) => {
                    const createValue = `${CREATE_PREFIX}${group.id}`;
                    const createLabel =
                      group.createLabel ??
                      (typeof group.heading === "string"
                        ? t`Create ${group.heading}`
                        : t`Create`);

                    return (
                      <div key={group.id}>
                        {groupIndex > 0 && <CommandSeparator />}
                        <CommandGroup
                          heading={group.heading}
                          className="overflow-visible"
                        >
                          {group.options.map((item) => {
                            const itemHoverText = optionSearchText(item);
                            const isSelected = item.value === value;

                            return (
                              <CommandItem
                                key={item.value}
                                value={item.value}
                                onSelect={() => {
                                  onChange?.(item.value);
                                  setSearch("");
                                  setOpen(false);
                                }}
                                style={{ minHeight: `${itemHeight}px` }}
                                className="flex items-center justify-between min-w-0"
                              >
                                {item.helper ? (
                                  <div
                                    className={cn(
                                      "flex flex-col min-w-0 flex-1",
                                      isSelected && "pr-2"
                                    )}
                                  >
                                    <TruncatedTooltipText
                                      className="block w-full truncate"
                                      tooltip={itemHoverText}
                                    >
                                      {item.label}
                                    </TruncatedTooltipText>
                                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                                      <TruncatedTooltipText
                                        className="truncate flex-1"
                                        tooltip={itemHoverText}
                                      >
                                        {item.helper}
                                      </TruncatedTooltipText>
                                      {item.helperRight && (
                                        <span className="flex-shrink-0">
                                          {item.helperRight}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <TruncatedTooltipText
                                    className="truncate flex-1"
                                    tooltip={itemHoverText}
                                  >
                                    {item.label}
                                  </TruncatedTooltipText>
                                )}
                                <LuCheck
                                  className={cn(
                                    "ml-auto h-4 w-4 flex-shrink-0",
                                    isSelected ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            );
                          })}
                          {group.showCreate && (
                            <CommandItem
                              key={createValue}
                              value={createValue}
                              onSelect={() => {
                                group.onCreateOption?.();
                                setSearch("");
                                setOpen(false);
                              }}
                              style={{ minHeight: `${itemHeight}px` }}
                              className="flex items-center gap-2 text-muted-foreground"
                            >
                              <LuPlus className="h-4 w-4 shrink-0" />
                              <span>{createLabel}</span>
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </div>
                    );
                  })
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {isClearable && !isReadOnly && value && (
          <IconButton
            variant={isInlinePreview ? "secondary" : "ghost"}
            aria-label={t`Clear`}
            icon={<LuX />}
            onClick={() => onChange?.("")}
            size={isInlinePreview ? "sm" : size}
            className="transition-transform active:scale-[0.96]"
          />
        )}
      </HStack>
    );
  }
);

GroupedCreatableCombobox.displayName = "GroupedCreatableCombobox";

export { GroupedCreatableCombobox };
