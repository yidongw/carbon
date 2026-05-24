import { ActionMenu } from "@carbon/react";
import type { JSX } from "react";
import { memo } from "react";
import RowActionsContainer from "./RowActionsContainer";

type RowActionMenuProps<T> = {
  rowKey: string;
  row: T;
  renderContextMenu: (row: T) => JSX.Element | null;
};

function RowActionMenu<T>({ row, renderContextMenu }: RowActionMenuProps<T>) {
  const content = renderContextMenu(row);
  if (!content) return null;

  return (
    <RowActionsContainer>
      <ActionMenu>{content}</ActionMenu>
    </RowActionsContainer>
  );
}

export default memo(RowActionMenu, (prev, next) => {
  return (
    prev.rowKey === next.rowKey &&
    prev.renderContextMenu === next.renderContextMenu
  );
}) as typeof RowActionMenu;
