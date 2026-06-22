import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  isUrlOverlay,
  OVERLAY_URL_PARAMS,
  type OverlayTarget,
  overlayFromUrlParams,
  overlayToUrlParams
} from "./overlay";
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Refs so callbacks/effects always read the latest without re-binding.
  const instancesRef = useRef(instances);
  instancesRef.current = instances;
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const clearOverlayParams = useCallback(
    (options?: { replace?: boolean }) => {
      const next = new URLSearchParams(searchParamsRef.current);
      let changed = false;
      for (const key of OVERLAY_URL_PARAMS) {
        if (next.has(key)) {
          next.delete(key);
          changed = true;
        }
      }
      if (!changed) return;
      const search = next.toString();
      navigate(
        { search: search ? `?${search}` : "" },
        { replace: options?.replace }
      );
    },
    [navigate]
  );

  const addInstance = useCallback(
    (
      target: OverlayTarget,
      options: OpenOverlayOptions | undefined,
      meta: { urlSynced: boolean; pushedUrl: boolean }
    ): string | null => {
      const entry = getOverlayRegistryEntry(target.id);
      if (!entry) return null;

      const instance: OverlayInstance = {
        id: createInstanceId(),
        overlayId: target.id,
        url: target.url,
        onCreated: options?.onCreated,
        onSuccess: options?.onSuccess,
        urlSynced: meta.urlSynced,
        pushedUrl: meta.pushedUrl
      };

      setInstances((prev) => {
        const withoutSame = prev.filter(
          (i) => i.overlayId !== target.id || i.url !== target.url
        );
        return [...withoutSame, instance];
      });

      return instance.id;
    },
    []
  );

  const openOverlay = useCallback(
    (target: OverlayTarget, options?: OpenOverlayOptions): string | null => {
      const urlSynced = isUrlOverlay(target.id);
      const id = addInstance(target, options, {
        urlSynced,
        pushedUrl: urlSynced
      });

      if (id && urlSynced) {
        const params = overlayToUrlParams(target);
        if (params) {
          const next = new URLSearchParams(searchParamsRef.current);
          for (const [key, value] of Object.entries(params)) {
            next.set(key, value);
          }
          // Push (not replace) so Back / close returns to where we were.
          // No pathname given -> the current page URL is preserved.
          navigate({ search: `?${next.toString()}` });
        }
      }

      return id;
    },
    [addInstance, navigate]
  );

  const closeOverlay = useCallback(
    (id: string) => {
      const instance = instancesRef.current.find((i) => i.id === id);
      setInstances((prev) => prev.filter((i) => i.id !== id));

      if (!instance?.urlSynced) return;
      if (instance.pushedUrl) {
        // Pop the entry we pushed when opening -> back to the previous URL.
        navigate(-1);
      } else {
        // Opened via deep link (no entry to pop) -> just strip the params.
        clearOverlayParams({ replace: true });
      }
    },
    [navigate, clearOverlayParams]
  );

  const closeAll = useCallback(() => {
    const hadUrlSynced = instancesRef.current.some((i) => i.urlSynced);
    setInstances([]);
    if (hadUrlSynced) clearOverlayParams({ replace: true });
  }, [clearOverlayParams]);

  // Reconcile URL -> overlay state for deep links and Back/Forward navigation.
  //
  // URL-synced overlays form a stack; the URL only ever names the *top* one.
  // The URL is the source of truth for which is on top, so we close any
  // URL-synced overlays stacked above the named one (leaving lower overlays —
  // and their callbacks — intact) and open it if it isn't already present.
  useEffect(() => {
    const urlTarget = overlayFromUrlParams(searchParams);
    const current = instancesRef.current;

    if (!urlTarget) {
      // No overlay named in the URL -> close every URL-synced overlay.
      const synced = new Set(
        current.filter((i) => i.urlSynced).map((i) => i.id)
      );
      if (synced.size > 0) {
        setInstances((prev) => prev.filter((i) => !synced.has(i.id)));
      }
      return;
    }

    const matchIndex = current.findIndex(
      (i) => i.urlSynced && i.url === urlTarget.url
    );

    if (matchIndex === -1) {
      // Not open yet (deep link / forward navigation) -> open it on top.
      // Already reflected in the URL, so don't push another history entry.
      addInstance(urlTarget, undefined, {
        urlSynced: true,
        pushedUrl: false
      });
      return;
    }

    // Surface the named overlay: drop any URL-synced overlays above it.
    const above = new Set(
      current
        .slice(matchIndex + 1)
        .filter((i) => i.urlSynced)
        .map((i) => i.id)
    );
    if (above.size > 0) {
      setInstances((prev) => prev.filter((i) => !above.has(i.id)));
    }
  }, [searchParams, addInstance]);

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
