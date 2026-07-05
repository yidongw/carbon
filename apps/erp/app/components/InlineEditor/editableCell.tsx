import type { CellContext } from "@tanstack/react-table";
import { InlineEditCell } from "./InlineEditCell";
import type { EditableCellConfig } from "./types";

/**
 * Turns an `EditableCellConfig` into a TanStack `cell` renderer, so a column becomes
 * editable by swapping its `cell` for `editableCell({...})` while keeping its header,
 * meta, and filters intact.
 */
export function editableCell<TRow extends { id?: string | null }>(
  config: EditableCellConfig<TRow>
) {
  return function EditableCell(ctx: CellContext<TRow, unknown>) {
    return <InlineEditCell row={ctx.row.original} config={config} />;
  };
}
