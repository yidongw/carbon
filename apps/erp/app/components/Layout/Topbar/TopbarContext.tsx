import { createContext, useContext, useState, type ReactNode } from "react";

type TopbarContextValue = {
  leftSlotEl: HTMLDivElement | null;
  setLeftSlotEl: (el: HTMLDivElement | null) => void;
  hasLeftContent: boolean;
  setHasLeftContent: (has: boolean) => void;
};

const TopbarContext = createContext<TopbarContextValue>({
  leftSlotEl: null,
  setLeftSlotEl: () => {},
  hasLeftContent: false,
  setHasLeftContent: () => {},
});

export function TopbarProvider({ children }: { children: ReactNode }) {
  const [leftSlotEl, setLeftSlotEl] = useState<HTMLDivElement | null>(null);
  const [hasLeftContent, setHasLeftContent] = useState(false);

  return (
    <TopbarContext.Provider
      value={{ leftSlotEl, setLeftSlotEl, hasLeftContent, setHasLeftContent }}
    >
      {children}
    </TopbarContext.Provider>
  );
}

export function useTopbarLeft() {
  return useContext(TopbarContext);
}
