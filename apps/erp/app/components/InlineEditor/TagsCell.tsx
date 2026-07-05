import { Badge, CreatableMultiSelect, HStack } from "@carbon/react";
import { useMemo } from "react";
import { LuTags } from "react-icons/lu";
import { useFetcher, useRevalidator } from "react-router";
import { overlay, useOverlay } from "~/components/Overlay";
import { path } from "~/utils/path";
import { useSynced } from "./useSynced";

function TagsPreview(value: string[]) {
  return (
    <HStack className="space-x-0 flex-grow gap-1 items-start">
      {value.map((label) => (
        <Badge
          key={label}
          className="max-w-[160px] truncate border dark:border-none dark:shadow-button-base"
          variant="secondary"
        >
          {label}
        </Badge>
      ))}
    </HStack>
  );
}

// Item sub-tables (part/tool/material/…) have no separate readableId column —
// their PK `id` IS the readable id, so the tags action's `.in("id", ...)` must be
// fed the row's readableId. Every other entity (customer, supplier, job, …) has a
// UUID `id` PK (readableId, if present, is a distinct display column), so those
// must be fed the row's `id`. Matches how the detail-page tag editors submit.
const READABLE_ID_TABLES = new Set([
  "part",
  "tool",
  "material",
  "consumable",
  "service",
  "fixture"
]);

/**
 * Inline tags editor for a table row. Mirrors the detail-page <Tags> field: a
 * badge preview plus a picker that adds/removes tags and can create a new tag via
 * the shared overlay. Persists to the shared tags action (keyed by the row id +
 * table), which is separate from the module bulk-update action.
 */
export function TagsCell<
  TRow extends {
    id?: string | null;
    readableId?: string | null;
    tags?: string[] | null;
  }
>({
  row,
  table,
  availableTags
}: {
  row: TRow;
  /** Underlying table name the tags action writes to, e.g. "part", "material". */
  table: string;
  availableTags: { name: string }[];
}) {
  const fetcher = useFetcher();
  const { openOverlay } = useOverlay();
  const revalidator = useRevalidator();
  const [value, setValue] = useSynced<string[]>(row.tags ?? []);

  const options = useMemo(
    () => availableTags.map((t) => ({ value: t.name, label: t.name })),
    [availableTags]
  );

  const submit = (next: string[]) => {
    setValue(next);
    const formData = new FormData();
    const rowId = READABLE_ID_TABLES.has(table)
      ? (row.readableId ?? row.id)
      : (row.id ?? row.readableId);
    formData.append("ids", rowId ?? "");
    formData.append("table", table);
    next.forEach((v) => {
      formData.append("value", v);
    });
    fetcher.submit(formData, { method: "post", action: path.to.tags });
  };

  return (
    <CreatableMultiSelect
      value={value}
      options={options}
      inline={(v) => TagsPreview(v)}
      inlineIcon={<LuTags />}
      onChange={submit}
      onCreateOption={(input) => {
        const name = input.trim();
        openOverlay(overlay.to.newTag({ table }, name ? { name } : undefined), {
          onSuccess: (data) => {
            const created = (data as { name?: string } | null)?.name;
            if (!created || value.includes(created)) return;
            submit([...value, created]);
          },
          onCreated: () => revalidator.revalidate()
        });
      }}
    />
  );
}
