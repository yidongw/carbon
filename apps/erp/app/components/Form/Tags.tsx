import type { CreatableMultiSelectProps } from "@carbon/form";
import { CreatableMultiSelect, useControlField } from "@carbon/form";
import { Badge, HStack } from "@carbon/react";
import { useMemo } from "react";
import { LuTags } from "react-icons/lu";
import { useRevalidator } from "react-router";
import { overlay, useOverlay } from "~/components/Overlay";

type TagsSelectProps = Omit<
  CreatableMultiSelectProps,
  "options" | "value" | "inline"
> & {
  availableTags: { name: string }[];
  table?: string;
  inline?: boolean;
};

const TagsPreview = (
  value: string[],
  options: { value: string; label: string; helper?: string }[],
  maxPreview?: number
) => {
  return (
    <HStack className="space-x-0 flex-grow gap-1 items-start">
      {maxPreview && value.length > maxPreview ? (
        <Badge
          variant="secondary"
          className="border dark:border-none dark:shadow-button-base"
        >
          {value.length} tags
        </Badge>
      ) : (
        value.map((label: string) => (
          <Badge
            className="max-w-[160px] truncate border dark:border-none dark:shadow-button-base"
            key={label}
            variant="secondary"
          >
            {label}
          </Badge>
        ))
      )}
    </HStack>
  );
};

const Tags = ({ table, availableTags, ...props }: TagsSelectProps) => {
  const { openOverlay } = useOverlay();
  const revalidator = useRevalidator();
  const [value, setValue] = useControlField<string[] | undefined>(props.name);

  const options = useMemo(
    () =>
      availableTags.map((c) => ({
        value: c.name,
        label: c.name
      })),
    [availableTags]
  );

  return (
    <CreatableMultiSelect
      label={props?.label ?? "Tag"}
      options={options}
      {...props}
      inline={props.inline ? TagsPreview : undefined}
      inlineIcon={<LuTags />}
      onCreateOption={(option) => {
        // Open the create-tag overlay, seeding the item type from this field
        // and the name from anything already typed.
        const name = option.trim();
        openOverlay(
          overlay.to.newTag({ table }, name ? { name } : undefined),
          {
            // Once created, select the new tag onto this record (updates the
            // field and persists via onChange) and revalidate so the option
            // list picks it up.
            onSuccess: (data) => {
              const created = (data as { name?: string } | null)?.name;
              if (!created) return;
              const current = value ?? [];
              if (current.includes(created)) return;
              const next = [...current, created];
              setValue(next);
              props.onChange?.(next);
            },
            onCreated: () => revalidator.revalidate()
          }
        );
      }}
    />
  );
};

Tags.displayName = "Tags";

export default Tags;
