import type { ReactElement, ReactNode } from "react";

/** Option shape shared by every inline editor (matches @carbon Select/Combobox). */
export type OptionItem = {
  value: string;
  label: string | ReactElement;
  helper?: string;
};

/**
 * Which bulk-update action a table's inline edits submit to. Each module has one
 * route; items send the id list as `items`, everyone else as `ids`.
 */
export type EntityUpdateConfig = {
  /** `path.to.*` action string, e.g. path.to.bulkUpdateItems. */
  action: string;
  idKey: "items" | "ids";
};

/** Supported inline editor kinds. Extend as later phases add cells. */
export type EditableKind = "enum" | "picker" | "boolean" | "text" | "date";

/** Dropdown-style editable cell (single value chosen from options). */
export type SelectCellConfig<TRow> = {
  kind: "enum" | "picker";
  /** Field name sent to the update action. */
  field: string;
  update: EntityUpdateConfig;
  /** Reads the current value from the row (decoupled from `field`, e.g. templateId). */
  value: (row: TRow) => string | null | undefined;
  /** Static options, or options derived from the row (conditional dropdowns). */
  options: OptionItem[] | ((row: TRow) => OptionItem[]);
  /** Allow clearing the value (shows the X). */
  clearable?: boolean;
  /** Inline badge for the selected value; defaults to a Badge with the option label. */
  renderInline?: (
    value: string,
    options: OptionItem[],
    row: TRow
  ) => ReactElement;
  /** Label to show when the value isn't in `options` (e.g. a name-only fallback). */
  fallbackLabel?: (row: TRow) => ReactNode;
};

/** Toggle-style editable cell backed by a boolean field. */
export type BooleanCellConfig<TRow> = {
  kind: "boolean";
  field: string;
  update: EntityUpdateConfig;
  value: (row: TRow) => boolean | null | undefined;
  /** Serialize the checked state for the action; defaults to "on"/"off". */
  serialize?: (checked: boolean) => string;
};

/** Free-text editable cell; commits on blur / Enter. */
export type TextCellConfig<TRow> = {
  kind: "text";
  field: string;
  update: EntityUpdateConfig;
  value: (row: TRow) => string | null | undefined;
  placeholder?: string;
};

/** Date editable cell (YYYY-MM-DD); inline preview + calendar popover. */
export type DateCellConfig<TRow> = {
  kind: "date";
  field: string;
  update: EntityUpdateConfig;
  value: (row: TRow) => string | null | undefined;
  /** How to render the selected date inline; defaults to the raw value. */
  renderInline?: (value: string) => ReactNode;
  /** Edit a full timestamp (calendar + time picker); stores an ISO datetime. */
  withTime?: boolean;
};

/**
 * Declarative description of one editable table cell. `editableCell(config)` turns
 * this into a TanStack cell renderer, so making a column editable is one descriptor.
 */
export type EditableCellConfig<TRow> =
  | SelectCellConfig<TRow>
  | BooleanCellConfig<TRow>
  | TextCellConfig<TRow>
  | DateCellConfig<TRow>;
