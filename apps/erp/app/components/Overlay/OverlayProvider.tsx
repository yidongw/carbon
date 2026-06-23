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
  type OverlayTarget,
  overlayStackFromParams,
  paramsWithOverlay,
  paramsWithoutOverlays,
  paramsWithoutTopOverlay
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

  const navigateToParams = useCallback(
    (next: URLSearchParams, options?: { replace?: boolean }) => {
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
        const next = paramsWithOverlay(searchParamsRef.current, target);
        if (next) {
          // Push (not replace) so Back / close returns to the previous stack.
          // No pathname given -> the current page URL is preserved.
          navigateToParams(next);
        }
      }

      return id;
    },
    [addInstance, navigateToParams]
  );

  const closeOverlay = useCallback(
    (id: string) => {
      const instance = instancesRef.current.find((i) => i.id === id);
      setInstances((prev) => prev.filter((i) => i.id !== id));

      if (!instance?.urlSynced) return;
      if (instance.pushedUrl) {
        // Pop the entry we pushed when opening -> back to the previous stack.
        navigate(-1);
      } else {
        // Opened via deep link (no entry to pop) -> pop this overlay's token.
        navigateToParams(paramsWithoutTopOverlay(searchParamsRef.current), {
          replace: true
        });
      }
    },
    [navigate, navigateToParams]
  );

  const closeAll = useCallback(() => {
    const hadUrlSynced = instancesRef.current.some((i) => i.urlSynced);
    setInstances([]);
    if (hadUrlSynced) {
      navigateToParams(paramsWithoutOverlays(searchParamsRef.current), {
        replace: true
      });
    }
  }, [navigateToParams]);

  // Reconcile URL -> overlay state for deep links and Back/Forward navigation.
  //
  // The URL encodes the full stack of URL-synced overlays (bottom -> top), so
  // it is the source of truth: close any URL-synced overlay no longer in the
  // URL, and open (in order) any that are in the URL but not yet present. This
  // makes a refresh / deep link restore the entire stack, not just the top.
  useEffect(() => {
    const desired = overlayStackFromParams(searchParams);
    const current = instancesRef.current;

    const desiredUrls = new Set(desired.map((t) => t.url));
    const presentUrls = new Set(
      current.filter((i) => i.urlSynced).map((i) => i.url)
    );

    const closeIds = new Set(
      current
        .filter((i) => i.urlSynced && !desiredUrls.has(i.url))
        .map((i) => i.id)
    );
    const toOpen = desired.filter((t) => !presentUrls.has(t.url));

    if (closeIds.size === 0 && toOpen.length === 0) return;

    if (closeIds.size > 0) {
      setInstances((prev) => prev.filter((i) => !closeIds.has(i.id)));
    }
    // Append in stack order so z-index / render order stays bottom -> top.
    // Already reflected in the URL, so don't push another history entry.
    for (const target of toOpen) {
      addInstance(target, undefined, { urlSynced: true, pushedUrl: false });
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
