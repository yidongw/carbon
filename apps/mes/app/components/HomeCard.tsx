import type { ReactNode } from "react";
import type { IconType } from "react-icons";

// Shared look for the MES home screen cards. Used by the section links
// (apps/mes/app/routes/x+/_index.tsx) and the tool triggers (AdjustInventory,
// EndShift, Suggestion) so a card looks the same whether it navigates, opens a
// modal, or anchors a popover.
export const homeCardClass =
  "flex flex-row gap-4 items-center px-6 py-5 w-full text-left shadow-button-base bg-gradient-to-bl from-card from-50% to-background rounded-lg group ring-2 ring-transparent hover:ring-white/10 cursor-pointer hover:scale-105 transition-all duration-300";

export function HomeCardBody({
  icon: Icon,
  title,
  description
}: {
  icon: IconType;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <>
      <div className="p-3 rounded-lg border shrink-0">
        <Icon className="text-2xl" />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-base font-medium tracking-tight">{title}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
    </>
  );
}
