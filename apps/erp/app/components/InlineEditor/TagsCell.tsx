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

// Stable fallback for rows whose view returns NULL tags. Inlining `?? []`
// would mint a new array every render, so useSynced's resync effect fires
// each time and setState-loops forever — the loop starves React's transition
// lane, so client-side navigations (search/sort/filter) never commit and the
// table freezes on the previous result.
const NO_TAGS: string[] = [];

/**
 * Inline tags editor for a table row. Mirrors the detail-page <Tags> field: a
 * badge preview plus a picker that adds/removes tags and can create a new tag via
 * the shared overlay. Persists to the shared tags action (keyed by the row id +
 * table), which is separate from the module bulk-update action.
 */
export function TagsCell({
  tagKey,
  tags,
  table,
  availableTags
}: {
  /**
   * The row's primary key in `table` — the value the tags action matches on
   * (`.in("id", ...)`). Item extension tables (part/tool/material/consumable/
   * style, …) are keyed by `readableId`; every other entity is keyed by `id`.
   * The caller passes it explicitly because the list VIEW's `id` is the item
   * UUID for item tables, so it would silently match no rows if used there.
   */
  tagKey: string | null | undefined;
  /** The row's current tags, from the list view. */
  tags: string[] | null | undefined;
  /** Underlying table name the tags action writes to, e.g. "part", "style". */
  table: string;
  availableTags: { name: string }[];
}) {
  const fetcher = useFetcher();
  const { openOverlay } = useOverlay();
  const revalidator = useRevalidator();
  const [value, setValue] = useSynced<string[]>(tags ?? NO_TAGS);

  const options = useMemo(
    () => availableTags.map((t) => ({ value: t.name, label: t.name })),
    [availableTags]
  );

  const submit = (next: string[]) => {
    setValue(next);
    const formData = new FormData();
    formData.append("ids", tagKey ?? "");
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
