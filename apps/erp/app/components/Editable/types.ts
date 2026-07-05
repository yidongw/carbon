export type EditableTableCellComponent<TData> = (
  props: EditableTableCellComponentProps<TData>
) => JSX.Element;

export type EditableTableCellComponentProps<T> = {
  value: unknown;
  row: T;
  accessorKey: string;
  onUpdate: (updates: Record<string, unknown>) => void;
  onError: () => void;
  /** Leave edit mode (e.g. when a dropdown closes). Optional for legacy cells. */
  onFinishEditing?: () => void;
};

export type Position = null | { row: number; column: number };

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    editableComponents?: Record<string, EditableTableCellComponent<TData>>;
    updateData?: (rowIndex: number, updates: Record<string, unknown>) => void;
  }
}
