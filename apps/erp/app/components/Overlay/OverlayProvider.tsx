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
  OVERLAY_PARAM,
  type OverlayTarget,
  overlayStackFromParams,
  overlayToken,
  paramsWithOverlayTokens,
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

function createInstance(
  target: OverlayTarget,
  options: OpenOverlayOptions | undefined,
  urlSynced: boolean
): OverlayInstance | null {
  if (!getOverlayRegistryEntry(target.id)) return null;
  return {
    id: createInstanceId(),
    overlayId: target.id,
    url: target.url,
    onCreated: options?.onCreated,
    onSuccess: options?.onSuccess,
    urlSynced,
    token: urlSynced ? (overlayToken(target) ?? undefined) : undefined
  };
}

/** Live page search params — overlay state lives in the URL, not the router. */
function currentSearch(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

/**
 * Mirror the open url-synced overlays in the URL via `history.replaceState` —
 * deliberately NOT `navigate()` (which would revalidate the page's loaders) and
 * NOT `pushState` (which desyncs React Router's back/forward index). We rewrite
 * the *current* entry in place, preserving React Router's history state, so only
 * the URL changes and RR stays consistent.
 *
 * The open instances are the source of truth: this writes exactly their tokens.
 */
function writeOverlayTokens(tokens: string[]) {
  const next = paramsWithOverlayTokens(currentSearch(), tokens);
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

  const syncedTokens = useCallback(
    (list: OverlayInstance[]) =>
      list
        .filter((i) => i.urlSynced && i.token)
        .map((i) => i.token as string),
    []
  );

  const openOverlay = useCallback(
    (target: OverlayTarget, options?: OpenOverlayOptions): string | null => {
      const urlSynced = isUrlOverlay(target.id);
      const instance = createInstance(target, options, urlSynced);
      if (!instance) return null;

      const prev = instancesRef.current;
      const withoutSame = prev.filter(
        (i) => i.overlayId !== target.id || i.url !== target.url
      );
      const nextInstances = [...withoutSame, instance];
      setInstances(nextInstances);

      if (urlSynced) writeOverlayTokens(syncedTokens(nextInstances));

      return instance.id;
    },
    [syncedTokens]
  );

  const closeOverlay = useCallback(
    (id: string) => {
      const instance = instancesRef.current.find((i) => i.id === id);
      const nextInstances = instancesRef.current.filter((i) => i.id !== id);
      setInstances(nextInstances);

      // Closing is the only thing that removes an overlay's URL token.
      if (instance?.urlSynced) writeOverlayTokens(syncedTokens(nextInstances));
    },
    [syncedTokens]
  );

  const closeAll = useCallback(() => {
    const hadUrlSynced = instancesRef.current.some((i) => i.urlSynced);
    setInstances([]);
    if (hadUrlSynced) writeOverlayTokens([]);
  }, []);

  // Reconcile on React Router navigations (and mount). The open instances are
  // the source of truth, so we never close here:
  //   - open any URL token that has no instance yet (deep links / shared URLs);
  //   - re-assert the open overlays' tokens onto the URL, since a navigation may
  //     have rebuilt the query and dropped them. Only an explicit close removes.
  const reconcile = useCallback(
    () => {
      const search = currentSearch();
      const urlTargets = overlayStackFromParams(search);
      const existing = instancesRef.current;
      const existingUrls = new Set(
        existing.filter((i) => i.urlSynced).map((i) => i.url)
      );

      const opened = urlTargets
        .filter((t) => !existingUrls.has(t.url))
        .map((t) => createInstance(t, undefined, true))
        .filter((i): i is OverlayInstance => i != null);
      if (opened.length > 0) setInstances((prev) => [...prev, ...opened]);

      const wantTokens = syncedTokens([
        ...existing.filter((i) => i.urlSynced),
        ...opened
      ]);
      const haveTokens = search.getAll(OVERLAY_PARAM);
      const inSync =
        wantTokens.length === haveTokens.length &&
        wantTokens.every((t) => haveTokens.includes(t));
      if (!inSync) writeOverlayTokens(wantTokens);
    },
    [syncedTokens]
  );

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
