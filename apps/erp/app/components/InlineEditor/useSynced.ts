import { useEffect, useState } from "react";

/**
 * Optimistic local state that resyncs whenever the row's server value changes
 * (revalidation or a server-side cascade).
 */
export function useSynced<T>(serverValue: T) {
  const [value, setValue] = useState<T>(serverValue);
  useEffect(() => {
    setValue(serverValue);
  }, [serverValue]);
  return [value, setValue] as const;
}
