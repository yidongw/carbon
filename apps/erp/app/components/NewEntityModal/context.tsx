import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useLocation } from "react-router";

type OpenState = {
  /** Path portion of the `to`, e.g. `/x/customer/new` */
  path: string;
  /** Search portion (including leading `?`), e.g. `?customerId=abc` */
  search: string;
};

type ContextValue = {
  state: OpenState | null;
  open: (to: string) => void;
  close: () => void;
};

const NewEntityModalContext = createContext<ContextValue | null>(null);

export function NewEntityModalProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<OpenState | null>(null);
  const location = useLocation();

  // Close the modal whenever the URL changes (e.g. after a successful submit
  // that follows a redirect to a detail page).
  const currentKey = location.pathname + location.search;
  const lastKeyRef = useRef(currentKey);
  useEffect(() => {
    if (currentKey !== lastKeyRef.current) {
      lastKeyRef.current = currentKey;
      setState(null);
    }
  }, [currentKey]);

  const value = useMemo<ContextValue>(
    () => ({
      state,
      open: (to) => {
        const [pathPart, searchPart] = to.split("?");
        setState({
          path: pathPart,
          search: searchPart ? `?${searchPart}` : ""
        });
      },
      close: () => setState(null)
    }),
    [state]
  );

  return (
    <NewEntityModalContext.Provider value={value}>
      {children}
    </NewEntityModalContext.Provider>
  );
}

export function useNewEntityModal() {
  const ctx = useContext(NewEntityModalContext);
  if (!ctx) {
    throw new Error(
      "useNewEntityModal must be used within <NewEntityModalProvider />"
    );
  }
  return ctx;
}
