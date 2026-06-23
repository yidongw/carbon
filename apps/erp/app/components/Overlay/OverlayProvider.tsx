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
 * Reflect the overlay stack in the URL via the History API — deliberately NOT
 * `navigate()`, so opening/closing an overlay doesn't trigger a React Router
 * navigation (which would revalidate the page's loaders). Only the URL changes.
 * React Router's history state is preserved so its back/forward stays intact.
 */
function writeSearch(next: URLSearchParams, mode: "push" | "replace") {
  const search = serializeSearch(next);
  const url =
    window.location.pathname +
    (search ? `?${search}` : "") +
    window.location.hash;
  const state = window.history.state;
  if (mode === "push") {
    window.history.pushState(state, "", url);
  } else {
    window.history.replaceState(state, "", url);
  }
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
        const next = paramsWithOverlay(currentSearch(), target);
        // Push (not replace) so Back / close returns to the previous stack.
        if (next) writeSearch(next, "push");
      }

      return id;
    },
    [addInstance]
  );

  const closeOverlay = useCallback((id: string) => {
    const instance = instancesRef.current.find((i) => i.id === id);
    setInstances((prev) => prev.filter((i) => i.id !== id));

    if (!instance?.urlSynced) return;
    if (instance.pushedUrl) {
      // Pop the entry we pushed when opening; popstate then reconciles the rest.
      window.history.back();
    } else {
      // Opened via deep link (no entry to pop) -> drop this overlay's token.
      writeSearch(paramsWithoutTopOverlay(currentSearch()), "replace");
    }
  }, []);

  const closeAll = useCallback(() => {
    const hadUrlSynced = instancesRef.current.some((i) => i.urlSynced);
    setInstances([]);
    if (hadUrlSynced) {
      writeSearch(paramsWithoutOverlays(currentSearch()), "replace");
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
      addInstance(target, undefined, { urlSynced: true, pushedUrl: false });
    }
  }, [addInstance]);

  // Deep links + React Router navigations (page changes drop overlay tokens, so
  // this closes stale overlays). Our own open/close use the History API, which
  // doesn't change the router location, so they don't trigger this.
  useEffect(() => {
    reconcile();
  }, [location, reconcile]);

  // Browser Back/Forward over our History-API entries (same router location, so
  // the effect above won't fire) — reconcile against the popped URL.
  useEffect(() => {
    window.addEventListener("popstate", reconcile);
    return () => window.removeEventListener("popstate", reconcile);
  }, [reconcile]);

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
