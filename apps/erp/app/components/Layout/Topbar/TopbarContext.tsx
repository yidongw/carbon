import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode
} from "react";

type TopbarContextValue = {
  leftContent: ReactNode;
  setLeftContent: (content: ReactNode) => void;
  clearLeftContent: () => void;
};

const TopbarContext = createContext<TopbarContextValue>({
  leftContent: null,
  setLeftContent: () => {},
  clearLeftContent: () => {}
});

export function TopbarProvider({ children }: { children: ReactNode }) {
  const [leftContent, setLeftContentState] = useState<ReactNode>(null);

  const setLeftContent = useCallback((content: ReactNode) => {
    setLeftContentState(content);
  }, []);

  const clearLeftContent = useCallback(() => {
    setLeftContentState(null);
  }, []);

  return (
    <TopbarContext.Provider value={{ leftContent, setLeftContent, clearLeftContent }}>
      {children}
    </TopbarContext.Provider>
  );
}

export function useTopbarLeft() {
  return useContext(TopbarContext);
}
