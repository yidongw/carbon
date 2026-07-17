import { useCallback } from "react";

export function useLocalizeColor() {
  return useCallback(
    (name: string | null | undefined): string | null | undefined => name,
    []
  );
}
