import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
let hydrated = false;

function setHydrated() {
  if (!hydrated) {
    hydrated = true;
    listeners.forEach((fn) => fn());
  }
}

// Fire once when the module loads on the client — module-level so it survives
// component mount/unmount cycles (React Router HydrateFallback transitions
// would cancel per-component timeouts via subscribe cleanup).
if (typeof window !== "undefined") {
  setTimeout(setHydrated, 0);
}

export default function useHydrated() {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => hydrated,
    () => false
  );
}
