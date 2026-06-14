import { cn } from "@carbon/react";
import type { PropsWithChildren } from "react";

type RowActionsContainerProps = PropsWithChildren<{
  className?: string;
}>;

/**
 * Wraps row-level action UI (menus, inline buttons) so that clicks inside it
 * don't bubble up to the row's navigation handler.
 */
export default function RowActionsContainer({
  children,
  className
}: RowActionsContainerProps) {
  return (
    <div
      className={cn("flex justify-end", className)}
      data-prevent-row-nav
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </div>
  );
}
