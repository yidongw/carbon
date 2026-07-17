import { SidebarTrigger } from "@carbon/react";
import type { ReactNode } from "react";
import { TopbarActions } from "./TopbarActions";

export function MesTopbar({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b bg-background px-2">
      <SidebarTrigger />
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
      <TopbarActions />
    </header>
  );
}
