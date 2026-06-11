import { useSyncExternalStore } from "react";

/**
 * Return a boolean indicating if the JS has been hydrated already.
 * When doing Server-Side Rendering, the result will always be false.
 * When doing Client-Side Rendering, the result will always be false on the
 * first render and true from then on. Even if a new component renders it will
 * always start with true.
 *
 * Uses useSyncExternalStore for correct SSR behavior without relying on
 * useEffect, which may not fire in all React Router v7 rendering scenarios.
 *
 * Example: Disable a button that needs JS to work.
 * ```tsx
 * const hydrated = useHydrated();
 * return (
 *   <button type="button" isDisabled={!hydrated} onClick={doSomethingCustom}>
 *     Click me
 *   </button>
 * );
 * ```
 */
export default function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
