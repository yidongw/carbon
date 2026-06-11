import { createContext, useContext, useState, type ReactNode } from "react";

type TopbarContextValue = {
  leftSlotEl: HTMLDivElement | null;
  setLeftSlotEl: (el: HTMLDivElement | null) => void;
};

const TopbarContext = createContext<TopbarContextValue>({
  leftSlotEl: null,
  // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
  setLeftSlotEl: () => {},
});

export function TopbarProvider({ children }: { children: ReactNode }) {
  const [leftSlotEl, setLeftSlotEl] = useState<HTMLDivElement | null>(() => {
    // On client, the [data-slot] div is already in the SSR'd HTML, so query it
    // immediately so portals render on the first client paint (no breadcrumb flash).
    if (typeof document !== "undefined") {
      return document.querySelector<HTMLDivElement>("[data-slot]");
    }
    return null;
  });

  return (
    <TopbarContext.Provider value={{ leftSlotEl, setLeftSlotEl }}>
      {children}
    </TopbarContext.Provider>
  );
}

export function useTopbarLeft() {
  return useContext(TopbarContext);
}
