import { Combobox, useMount } from "@carbon/react";
import { useMemo } from "react";
import { useFetcher } from "react-router";
import { path } from "~/utils/path";

export type StyleOption = { value: string; label: string; helper?: string };

type StyleOptionRow = {
  id: string;
  colorCode?: string;
  colorName?: string;
  sizeCode?: string;
  sizeName?: string;
};

type AddStyleOptionButtonProps = {
  /** The style item.id the option is added to. */
  itemId: string;
  kind: "color" | "size";
  /** Already-assigned Color/Size attribute value ids — excluded from the dropdown. */
  assignedIds: string[];
  /**
   * Pre-fetched options so callers rendering many pickers (the styles table)
   * share a single load. Omit to self-fetch (e.g. the style detail page).
   */
  options?: StyleOption[];
};

// Inline "+" dropdown that adds a single color/size to a style, mirroring the
// Item Group inline picker. Add-only: it only offers options not already
// assigned, and submits to the add route (which never removes anything).
const AddStyleOptionButton = ({
  itemId,
  kind,
  assignedIds,
  options
}: AddStyleOptionButtonProps) => {
  const listFetcher = useFetcher<{ data: StyleOptionRow[] | null }>();
  const submitFetcher = useFetcher();

  const selfFetch = !options;
  useMount(() => {
    if (selfFetch) {
      listFetcher.load(
        kind === "color" ? path.to.api.styleColors : path.to.api.styleSizes
      );
    }
  });

  const baseOptions = useMemo<StyleOption[]>(() => {
    if (options) return options;
    return (listFetcher.data?.data ?? []).map((row) =>
      kind === "color"
        ? {
            value: row.id,
            label: row.colorName || row.colorCode || "",
            helper: row.colorCode
          }
        : {
            value: row.id,
            label: row.sizeCode || "",
            helper: row.sizeName
          }
    );
  }, [options, listFetcher.data, kind]);

  const available = useMemo(() => {
    const assigned = new Set(assignedIds);
    return baseOptions.filter((option) => !assigned.has(option.value));
  }, [baseOptions, assignedIds]);

  const add = (optionId: string) => {
    if (!optionId) return;
    const formData = new FormData();
    formData.append(
      kind === "color" ? "styleColorIds[0]" : "styleSizeIds[0]",
      optionId
    );
    submitFetcher.submit(formData, {
      method: "post",
      action: path.to.addStyleColorsSizes(itemId)
    });
  };

  // Combobox's inline mode makes its wrapper `w-full` (built to fill a table
  // cell); constrain it so the "+" trigger stays compact and sits inline with
  // the badges instead of wrapping onto its own line.
  return (
    <span className="inline-flex [&>div]:!w-auto">
      <Combobox
        options={available}
        inline={() => null}
        onChange={add}
        isReadOnly={submitFetcher.state !== "idle"}
      />
    </span>
  );
};

export default AddStyleOptionButton;
