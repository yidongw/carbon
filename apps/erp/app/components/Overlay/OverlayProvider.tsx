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
import { useLocation } from "react-router";
import {
  isUrlOverlay,
  type OverlayTarget,
  overlayStackFromParams,
  paramsWithOverlay,
  paramsWithoutOverlays,
  paramsWithoutTopOverlay,
  serializeSearch
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

/** Live page search params — overlay state lives in the URL, not the router. */
function currentSearch(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

/**
 * Reflect the overlay stack in the URL via `history.replaceState` — deliberately
 * NOT `navigate()` (which would revalidate the page's loaders) and NOT
 * `pushState` (which would add a history entry React Router doesn't know about,
 * desyncing its back/forward index tracking). We rewrite the *current* entry in
 * place, preserving React Router's history state, so only the URL changes and RR
 * stays perfectly consistent. Trade-off: the browser Back button doesn't close
 * an overlay — the X / Esc / submit do (and restore the URL the same way).
 */
function writeSearch(next: URLSearchParams) {
  const search = serializeSearch(next);
  const url =
    window.location.pathname +
    (search ? `?${search}` : "") +
    window.location.hash;
  window.history.replaceState(window.history.state, "", url);
}

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<OverlayInstance[]>([]);
  const location = useLocation();

  // Ref so callbacks/effects always read the latest instances without re-binding.
  const instancesRef = useRef(instances);
  instancesRef.current = instances;

  const addInstance = useCallback(
    (
      target: OverlayTarget,
      options: OpenOverlayOptions | undefined,
      meta: { urlSynced: boolean }
    ): string | null => {
      const entry = getOverlayRegistryEntry(target.id);
      if (!entry) return null;

      const instance: OverlayInstance = {
        id: createInstanceId(),
        overlayId: target.id,
        url: target.url,
        onCreated: options?.onCreated,
        onSuccess: options?.onSuccess,
        urlSynced: meta.urlSynced
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
      const id = addInstance(target, options, { urlSynced });

      if (id && urlSynced) {
        const next = paramsWithOverlay(currentSearch(), target);
        if (next) writeSearch(next);
      }

      return id;
    },
    [addInstance]
  );

  const closeOverlay = useCallback((id: string) => {
    const instance = instancesRef.current.find((i) => i.id === id);
    setInstances((prev) => prev.filter((i) => i.id !== id));

    if (instance?.urlSynced) {
      writeSearch(paramsWithoutTopOverlay(currentSearch()));
    }
  }, []);

  const closeAll = useCallback(() => {
    const hadUrlSynced = instancesRef.current.some((i) => i.urlSynced);
    setInstances([]);
    if (hadUrlSynced) {
      writeSearch(paramsWithoutOverlays(currentSearch()));
    }
  }, []);

  // Reconcile overlay instances to whatever the URL says. The URL encodes the
  // full stack (bottom -> top), so it is the source of truth: close any
  // URL-synced overlay no longer in the URL, and open (in order) any that are in
  // the URL but not yet present. A refresh / deep link restores the whole stack.
  const reconcile = useCallback(() => {
    const desired = overlayStackFromParams(currentSearch());
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
    // Already reflected in the URL, so don't write it again.
    for (const target of toOpen) {
      addInstance(target, undefined, { urlSynced: true });
    }
  }, [addInstance]);

  // Drive reconciliation off React Router navigations (and the initial mount):
  // a deep link opens its overlays, and navigating to another page drops the
  // overlay tokens so stale overlays close. Our own open/close use
  // replaceState, which doesn't change the router location, so they don't
  // re-trigger this — they update instances directly.
  useEffect(() => {
    reconcile();
  }, [location, reconcile]);

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
