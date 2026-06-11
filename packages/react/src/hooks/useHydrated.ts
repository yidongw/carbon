import { useSyncExternalStore } from "react";

/**
 * Return a boolean indicating if the JS has been hydrated already.
 * When doing Server-Side Rendering, the result will always be false.
 * When doing Client-Side Rendering, the result will always be false on the
 * first render and true from then on.
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
    // Notify React after mount so it re-reads getSnapshot() → true
    (onStoreChange) => {
      const id = setTimeout(onStoreChange, 0);
      return () => clearTimeout(id);
    },
    () => true,
    () => false
  );
}
