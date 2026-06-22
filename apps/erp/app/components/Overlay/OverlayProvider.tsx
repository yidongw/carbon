import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";
import type { OverlayTarget } from "./overlay";
import { getOverlayRegistryEntry } from "./overlay.registry";
import type { OpenOverlayOptions, OverlayInstance } from "./types";

type OverlayContextValue = {
  instances: OverlayInstance[];
  openOverlay: (
    target: OverlayTarget,
    options?: OpenOverlayOptions
  ) => string | null;
  closeOverlay: (id: string) => void;
  closeAll: () => void;
};

const OverlayContext = createContext<OverlayContextValue | null>(null);

function createInstanceId() {
  return crypto.randomUUID();
}

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<OverlayInstance[]>([]);

  const closeOverlay = useCallback((id: string) => {
    setInstances((prev) => {
      const filtered = prev.filter((i) => i.id !== id);

      // If no more overlays are open, clean up the URL
      if (filtered.length === 0 && typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (url.searchParams.has("overlay")) {
          url.searchParams.delete("overlay");
          window.history.replaceState(
            {},
            "",
            url.search ? `${url.pathname}${url.search}` : url.pathname
          );
        }
      }

      return filtered;
    });
  }, []);

  const closeAll = useCallback(() => {
    setInstances([]);
  }, []);

  const openOverlay = useCallback(
    (target: OverlayTarget, options?: OpenOverlayOptions): string | null => {
      const entry = getOverlayRegistryEntry(target.id);
      if (!entry) return null;

      const instance: OverlayInstance = {
        id: createInstanceId(),
        overlayId: target.id,
        url: target.url,
        onCreated: options?.onCreated,
        onSuccess: options?.onSuccess
      };

      setInstances((prev) => {
        const withoutSame = prev.filter(
          (i) => i.overlayId !== target.id || i.url !== target.url
        );
        return [...withoutSame, instance];
      });

      // Update browser URL to include overlay parameter (makes it shareable)
      if (typeof window !== "undefined" && target.url) {
        const targetUrl = new URL(target.url, window.location.origin);

        // Update URL to include the overlay parameter
        // This makes the overlay shareable regardless of current path
        window.history.replaceState(
          {},
          "",
          `${targetUrl.pathname}${targetUrl.search}`
        );
      }

      return instance.id;
    },
    []
  );

  const value = useMemo(
    () => ({ instances, openOverlay, closeOverlay, closeAll }),
    [instances, openOverlay, closeOverlay, closeAll]
  );

  return (
    <OverlayContext.Provider value={value}>
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) {
    throw new Error("useOverlay must be used within OverlayProvider");
  }
  return ctx;
}
